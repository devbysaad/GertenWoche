import type { Handle, HandleFetch } from '@sveltejs/kit';
import { validateToken } from '$lib/server/auth';

// ============================================================
// Simple in-memory rate limiter for search / API endpoints
// ============================================================
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per window
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

// Clean up stale rate limit records every 5 minutes
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

// Cache-Control presets
//
// IMPORTANT: any response whose body depends on the session cookie (`wp_token`)
// MUST NOT be cached publicly. If it is, the browser will reuse a previous
// user's HTML when a different user logs in — that's exactly the
// "still shows the old account" bug.
//
// Strategy:
//   - Anonymous requests (no auth cookie) → keep the existing public caching.
//   - Authenticated requests (cookie present) → `private, no-store` so the
//     browser never reuses the response across sessions.
//   - Account pages (`/mein-konto*`) → always private regardless of cookie.
function getCacheControl(pathname: string, isAuthenticated: boolean): string {
	if (pathname.startsWith('/api/')) return 'no-store, must-revalidate';
	if (pathname.startsWith('/_app/')) return 'public, max-age=31536000, immutable';
	if (pathname === '/sitemap.xml') return 'public, max-age=3600, s-maxage=3600';
	if (pathname === '/robots.txt') return 'public, max-age=86400';

	// Personal account area — never cache, even for the same user, so a logout
	// in another tab is visible immediately.
	if (pathname.startsWith('/mein-konto')) return 'private, no-store, must-revalidate';

	// Any logged-in request must be served privately so the rendered username
	// in the header / sidebar can never bleed across sessions.
	if (isAuthenticated) return 'private, no-store, must-revalidate';

	if (pathname.startsWith('/category/') || pathname.match(/^\/[a-z-]+\/[a-z0-9-]+$/)) {
		return 'public, max-age=300, stale-while-revalidate=60';
	}
	if (pathname === '/') return 'public, max-age=180, stale-while-revalidate=60';
	return 'public, max-age=600, stale-while-revalidate=120';
}

// ============================================================
// Main handle hook — fully serverless, zero filesystem access
// ============================================================
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url } = event;
	const start = Date.now();

	// ── Resolve session from WordPress JWT cookie ──
	try {
		const token = event.cookies.get('wp_token');
		if (token) {
			// Race against a 9s timeout so slow WP never blocks page renders
			const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 9_000));
			event.locals.user = await Promise.race([validateToken(token), timeout]);
		} else {
			event.locals.user = null;
		}
	} catch {
		event.locals.user = null;
	}

	// ── Rate-limit search and API endpoints ──────────────────────
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/search')) {
		const ip = getClientIp(request);
		if (!checkRateLimit(ip)) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: { 'Retry-After': '60', 'Content-Type': 'text/plain', ...SECURITY_HEADERS }
			});
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-type' || name === 'x-sveltekit-page'
	});

	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		headers.set(key, value);
	}

	const isAuthenticated = !!event.cookies.get('wp_token') || !!event.locals.user;
	headers.set('Cache-Control', getCacheControl(url.pathname, isAuthenticated));

	// Tell every cache (browser, CDN, proxy) that the response body may differ
	// based on the session cookie. Without this, a response generated for User
	// A could be reused for User B even when our own Cache-Control says
	// "private" — because the cache key wouldn't include the cookie.
	const existingVary = headers.get('Vary');
	if (existingVary) {
		if (!/\bCookie\b/i.test(existingVary)) {
			headers.set('Vary', `${existingVary}, Cookie`);
		}
	} else {
		headers.set('Vary', 'Cookie');
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
