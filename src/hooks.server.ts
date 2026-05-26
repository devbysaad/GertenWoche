import type { Handle, HandleFetch } from '@sveltejs/kit';
import { refreshWordPressToken, validateToken } from '$lib/server/auth';

// ============================================================
// Simple in-memory rate limiter for search / API endpoints
// ============================================================
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60;           // 60 requests per window
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
		request.headers.get('x-real-ip') ??
		'unknown'
	);
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const record = rateLimitMap.get(ip);

	if (!record || now > record.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}

	if (record.count >= RATE_LIMIT_MAX) return false;

	record.count++;
	return true;
}

setInterval(
	() => {
		const now = Date.now();
		for (const [ip, record] of rateLimitMap.entries()) {
			if (now > record.resetAt) rateLimitMap.delete(ip);
		}
	},
	5 * 60_000
);

// ============================================================
// Security headers (added to every response)
// ============================================================
const SECURITY_HEADERS: Record<string, string> = {
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'X-XSS-Protection': '1; mode=block',
	...(process.env.NODE_ENV === 'production'
		? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }
		: {})
};

// ============================================================
// Cache-Control resolver — auth-aware
// ============================================================
const PRIVATE_NO_STORE = 'private, no-store, must-revalidate';

/** True if the request/response should never be cached by intermediaries or shared. */
function isAuthSensitive(pathname: string, hasAuthCookie: boolean, hasUser: boolean): boolean {
	if (hasAuthCookie || hasUser) return true;
	// Always treat the account area + auth pages as auth-sensitive, even when
	// no cookie is present yet — otherwise a public CDN (or the browser's
	// own back-forward cache) could memoize the anonymous render and serve
	// it to a logged-in user on the next visit. This also guarantees the
	// "logged-in users get redirected" guard in +page.server.ts actually
	// runs on every navigation.
	if (pathname.startsWith('/mein-konto'))             return true;
	if (pathname.startsWith('/anmelden-registrieren'))  return true;
	if (pathname.startsWith('/api/auth/'))              return true;
	if (pathname.startsWith('/api/account/'))           return true;
	return false;
}

function getPublicCacheControl(pathname: string): string {
	// `/api/weather` is purely public, has its own short s-maxage + stale-
	// while-revalidate set inside the handler, and benefits a lot from
	// edge caching. Pass it through instead of forcing `no-store`.
	if (pathname === '/api/weather') return '';
	if (pathname.startsWith('/api/')) return 'no-store, must-revalidate';
	if (pathname.startsWith('/_app/')) return 'public, max-age=31536000, immutable';
	if (pathname === '/sitemap.xml') return 'public, max-age=3600, s-maxage=3600';
	if (pathname === '/robots.txt') return 'public, max-age=86400';
	if (pathname.startsWith('/category/') || pathname.match(/^\/[a-z-]+\/[a-z0-9-]+$/)) {
		return 'public, max-age=300, stale-while-revalidate=60';
	}
	if (pathname === '/') return 'public, max-age=180, stale-while-revalidate=60';
	return 'public, max-age=600, stale-while-revalidate=120';
}

// ============================================================
// Token-refresh window — refresh transparently when < 24h remain
// ============================================================
const REFRESH_BEFORE_EXPIRY_MS = 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

// ============================================================
// Main handle hook
// ============================================================
export const handle: Handle = async ({ event, resolve }) => {
	const { url } = event;
	const start = Date.now();

	const initialToken = event.cookies.get('wp_token');
	const hasAuthCookie = Boolean(initialToken);

	// ── 1. Resolve session from cookie (with hard timeout) ───────────────
	if (initialToken) {
		try {
			const timeout = new Promise<null>((res) => setTimeout(() => res(null), 12_000));
			event.locals.user = await Promise.race([validateToken(initialToken), timeout]);
		} catch {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	// ── 2. Transparent refresh when JWT is close to expiring ─────────────
	const user = event.locals.user;
	if (user && user.expiresAt) {
		const msLeft = user.expiresAt * 1000 - Date.now();
		if (msLeft > 0 && msLeft < REFRESH_BEFORE_EXPIRY_MS) {
			try {
				const refreshed = await refreshWordPressToken(user.token);
				event.locals.user = refreshed;
				event.cookies.set('wp_token', refreshed.token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge: SESSION_MAX_AGE,
					path: '/'
				});
			} catch {
				// Leave the existing (still-valid-for-now) session in place.
			}
		}
	}

	// ── 3. Rate-limit search and API endpoints ───────────────────────────
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/search')) {
		const ip = getClientIp(event.request);
		if (!checkRateLimit(ip)) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: {
					'Retry-After': '60',
					'Content-Type': 'text/plain',
					Vary: 'Cookie',
					...SECURITY_HEADERS
				}
			});
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-type' || name === 'x-sveltekit-page'
	});

	// ── 4. Headers ───────────────────────────────────────────────────────
	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);

	// Always vary on Cookie so intermediaries treat authenticated and
	// anonymous renders as distinct cache entries (this was the root cause
	// of the "wrong user shown after login" bug previously reported).
	headers.append('Vary', 'Cookie');

	const sensitive = isAuthSensitive(url.pathname, hasAuthCookie, Boolean(event.locals.user));
	if (sensitive) {
		headers.set('Cache-Control', PRIVATE_NO_STORE);
	} else {
		const cc = getPublicCacheControl(url.pathname);
		// Empty string from the resolver means "this route knows what cache
		// headers it wants — don't override them". Used for /api/weather.
		if (cc) headers.set('Cache-Control', cc);
	}

	headers.set('Server-Timing', `total;dur=${Date.now() - start};desc="Server total"`);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

// ============================================================
// HandleFetch — sets User-Agent for WordPress API requests
// ============================================================
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const modifiedRequest = new Request(request, {
		headers: {
			...Object.fromEntries(request.headers.entries()),
			'User-Agent': 'GartenWoche-Clone/1.0 (https://gartenwoche.ch)'
		}
	});
	return fetch(modifiedRequest);
};
