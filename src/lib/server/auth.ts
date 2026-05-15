const WP_URL          = 'https://gartenwoche.ch/wp-json';
const JWT_ENDPOINT    = `${WP_URL}/jwt-auth/v1/token`;
const VALIDATE_ENDPOINT = `${WP_URL}/jwt-auth/v1/token/validate`;
const ME_ENDPOINT     = `${WP_URL}/wp/v2/users/me`;
const AUTH_TIMEOUT_MS = 8_000; // 8s max — prevents hanging page loads in production

const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// ── Server-side token cache (TTL: 10 min) ────────────────────────────────────
interface CacheEntry {
	user: {
		id: number; username: string; name: string;
		email: string; avatar: string; roles: string[];
		isPro: boolean; token: string;
	};
	expiresAt: number;
}
const tokenCache = new Map<string, CacheEntry>();
const CACHE_TTL  = 10 * 60_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapProfileToUser(profile: any, token: string) {
	return {
		id:       profile.id           as number,
		username: profile.slug         as string,
		name:     profile.name         as string,
		email:    (profile.email ?? '')          as string,
		avatar:   (profile.avatar_urls?.['96'] ?? '') as string,
		roles:    (profile.roles ?? [])          as string[],
		isPro:    (profile.roles ?? []).some((r: string) => PRO_ROLES.includes(r)),
		token
	};
}

/** Fetch with hard timeout. Returns the Response regardless of status (for login). */
async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
	const ctrl  = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), AUTH_TIMEOUT_MS);
	try {
		const res = await fetch(url, { ...init, signal: ctrl.signal });
		clearTimeout(timer);
		return res;
	} catch (err) {
		clearTimeout(timer);
		throw err; // rethrow — caller handles
	}
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Authenticate against WordPress JWT Auth plugin.
 * Returns full user object including token.
 * Throws on invalid credentials or network error.
 */
export async function loginWithWordPress(username: string, password: string) {
	let jwtRes: Response;
	try {
		jwtRes = await timedFetch(JWT_ENDPOINT, {
			method:  'POST',
			headers: { 'Content-Type': 'application/json' },
			body:    JSON.stringify({ username, password })
		});
	} catch {
		throw new Error('WordPress-Server nicht erreichbar. Bitte später versuchen.');
	}

	if (!jwtRes.ok) {
		const err = await jwtRes.json().catch(() => ({}));
		throw new Error(err.message || 'Ungültige Zugangsdaten');
	}

	const data  = await jwtRes.json();
	const token = data.token as string;
	if (!token) throw new Error('Kein Token empfangen');

	// Fetch user profile with the fresh token
	let profileRes: Response;
	try {
		profileRes = await timedFetch(ME_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` }
		});
	} catch {
		throw new Error('Benutzerprofil konnte nicht geladen werden');
	}

	if (!profileRes.ok) throw new Error('Benutzerprofil konnte nicht geladen werden');

	const profile = await profileRes.json();
	const user    = mapProfileToUser(profile, token);

	// Warm the cache so the first page load after login is instant
	tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
	return user;
}

/**
 * Validate a JWT cookie token and return the user.
 * Uses in-process cache to avoid WP API calls on every request.
 * Returns null if token is invalid, expired, or WP unreachable.
 */
export async function validateToken(token: string) {
	try {
		// ── 1. Cache hit — zero WP API calls ──────────────────────────
		const cached = tokenCache.get(token);
		if (cached && Date.now() < cached.expiresAt) {
			return cached.user;
		}

		// ── 2. Validate JWT signature with WordPress ───────────────────
		let valRes: Response;
		try {
			valRes = await timedFetch(VALIDATE_ENDPOINT, {
				method:  'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch {
			// WP unreachable — fail gracefully, don't crash the page
			tokenCache.delete(token);
			return null;
		}

		if (!valRes.ok) {
			tokenCache.delete(token); // token is expired/invalid
			return null;
		}

		// ── 3. Fetch fresh user profile ────────────────────────────────
		let profileRes: Response;
		try {
			profileRes = await timedFetch(ME_ENDPOINT, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch {
			return null;
		}

		if (!profileRes.ok) return null;

		const profile = await profileRes.json();
		const user    = mapProfileToUser(profile, token);

		tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
		return user;
	} catch {
		return null; // never crash the hooks handler
	}
}

// Prune expired cache entries every 15 minutes
setInterval(() => {
	const now = Date.now();
	for (const [k, v] of tokenCache.entries()) {
		if (now > v.expiresAt) tokenCache.delete(k);
	}
}, 15 * 60_000);
