import type { Handle, HandleFetch } from '@sveltejs/kit';

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
		return true; // allowed
	}

	if (record.count >= RATE_LIMIT_MAX) return false; // blocked

	record.count++;
	return true; // allowed
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
	// HSTS — 1 year, include subdomains (enable in prod, not in dev)
	...(process.env.NODE_ENV === 'production'
		? {
				'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
			}
		: {})
};

// Cache-Control presets
function getCacheControl(pathname: string): string {
	// API endpoints — no cache by default
	if (pathname.startsWith('/api/')) return 'no-store, must-revalidate';

	// Static assets (handled by SvelteKit's file serving with content hash)
	if (pathname.startsWith('/_app/')) return 'public, max-age=31536000, immutable';

	// SEO endpoints
	if (pathname === '/sitemap.xml') return 'public, max-age=3600, s-maxage=3600';
	if (pathname === '/robots.txt') return 'public, max-age=86400';

	// Article/category pages — 5 minutes stale-while-revalidate
	if (
		pathname.startsWith('/category/') ||
		pathname.match(/^\/[a-z-]+\/[a-z0-9-]+$/)
	) {
		return 'public, max-age=300, stale-while-revalidate=60';
	}

	// Homepage — 3 minutes
	if (pathname === '/') return 'public, max-age=180, stale-while-revalidate=60';

	// Other pages — 10 minutes
	return 'public, max-age=600, stale-while-revalidate=120';
}

// ============================================================
// Main handle hook
// ============================================================
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url } = event;
	const start = Date.now();

	// Rate-limit search and API endpoints
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/search')) {
		const ip = getClientIp(request);
		if (!checkRateLimit(ip)) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: {
					'Retry-After': '60',
					'Content-Type': 'text/plain',
					...SECURITY_HEADERS
				}
			});
		}
	}

	// Resolve the response
	const response = await resolve(event, {
		// Enable HTML streaming for faster TTFB
		filterSerializedResponseHeaders: (name) =>
			name === 'content-type' || name === 'x-sveltekit-page'
	});

	// Clone headers (Response headers are immutable)
	const headers = new Headers(response.headers);

	// Apply security headers
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		headers.set(key, value);
	}

	// Apply Cache-Control
	const cacheControl = getCacheControl(url.pathname);
	headers.set('Cache-Control', cacheControl);

	// Server-Timing header for debugging
	const elapsed = Date.now() - start;
	headers.set('Server-Timing', `total;dur=${elapsed};desc="Server total"`);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

// ============================================================
// HandleFetch — controls outgoing fetch from server load fns
// ============================================================
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	// Set a User-Agent for the WordPress API so it doesn't block us
	const modifiedRequest = new Request(request, {
		headers: {
			...Object.fromEntries(request.headers.entries()),
			'User-Agent': 'GartenWoche-Clone/1.0 (https://gartenwoche.ch)'
		}
	});

	return fetch(modifiedRequest);
};
