// import { env } from '$env/dynamic/private';

// const WP_URL          = 'https://gartenwoche.ch/wp-json';
// const JWT_ENDPOINT    = env.WP_JWT_AUTH_URL ?? `${WP_URL}/jwt-auth/v1/token`;
// const VALIDATE_ENDPOINT = `${WP_URL}/jwt-auth/v1/token/validate`;
// const ME_ENDPOINT     = `${WP_URL}/wp/v2/users/me`;
// const AUTH_TIMEOUT_MS = 8_000; // 8s max — prevents hanging page loads in production

// const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// // ── Server-side token cache (TTL: 10 min) ────────────────────────────────────
// interface CacheEntry {
// 	user: {
// 		id: number; username: string; name: string;
// 		email: string; avatar: string; roles: string[];
// 		isPro: boolean; token: string;
// 	};
// 	expiresAt: number;
// }
// const tokenCache = new Map<string, CacheEntry>();
// const CACHE_TTL  = 10 * 60_000;

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function mapProfileToUser(profile: any, token: string) {
// 	return {
// 		id:       profile.id           as number,
// 		username: profile.slug         as string,
// 		name:     profile.name         as string,
// 		email:    (profile.email ?? '')          as string,
// 		avatar:   (profile.avatar_urls?.['96'] ?? '') as string,
// 		roles:    (profile.roles ?? [])          as string[],
// 		isPro:    (profile.roles ?? []).some((r: string) => PRO_ROLES.includes(r)),
// 		token
// 	};
// }

// /** Fetch with hard timeout. Returns the Response regardless of status (for login). */
// async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
// 	const ctrl  = new AbortController();
// 	const timer = setTimeout(() => ctrl.abort(), AUTH_TIMEOUT_MS);
// 	try {
// 		const res = await fetch(url, { ...init, signal: ctrl.signal });
// 		clearTimeout(timer);
// 		return res;
// 	} catch (err) {
// 		clearTimeout(timer);
// 		throw err; // rethrow — caller handles
// 	}
// }

// // ── Public API ────────────────────────────────────────────────────────────────

// /**
//  * Authenticate against WordPress JWT Auth plugin.
//  * Returns full user object including token.
//  * Throws on invalid credentials or network error.
//  */
// export async function loginWithWordPress(username: string, password: string) {
// 	let jwtRes: Response;
// 	try {
// 		jwtRes = await timedFetch(JWT_ENDPOINT, {
// 			method:  'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body:    JSON.stringify({ username, password })
// 		});
// 	} catch {
// 		throw new Error('WordPress-Server nicht erreichbar. Bitte später versuchen.');
// 	}

// 	if (!jwtRes.ok) {
// 		const err = await jwtRes.json().catch(() => ({}));
// 		throw new Error(err.message || 'Ungültige Zugangsdaten');
// 	}

// 	const data  = await jwtRes.json();
// 	const token = data.token as string;
// 	if (!token) throw new Error('Kein Token empfangen');

// 	// Fetch user profile with the fresh token
// 	let profileRes: Response;
// 	try {
// 		profileRes = await timedFetch(ME_ENDPOINT, {
// 			headers: { Authorization: `Bearer ${token}` }
// 		});
// 	} catch {
// 		throw new Error('Benutzerprofil konnte nicht geladen werden');
// 	}

// 	if (!profileRes.ok) throw new Error('Benutzerprofil konnte nicht geladen werden');

// 	const profile = await profileRes.json();
// 	const user    = mapProfileToUser(profile, token);

// 	// Warm the cache so the first page load after login is instant
// 	tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
// 	return user;
// }

// /**
//  * Validate a JWT cookie token and return the user.
//  * Uses in-process cache to avoid WP API calls on every request.
//  * Returns null if token is invalid, expired, or WP unreachable.
//  */
// export async function validateToken(token: string) {
// 	try {
// 		// ── 1. Cache hit — zero WP API calls ──────────────────────────
// 		const cached = tokenCache.get(token);
// 		if (cached && Date.now() < cached.expiresAt) {
// 			return cached.user;
// 		}

// 		// ── 2. Validate JWT signature with WordPress ───────────────────
// 		let valRes: Response;
// 		try {
// 			valRes = await timedFetch(VALIDATE_ENDPOINT, {
// 				method:  'POST',
// 				headers: { Authorization: `Bearer ${token}` }
// 			});
// 		} catch {
// 			// WP unreachable — fail gracefully, don't crash the page
// 			tokenCache.delete(token);
// 			return null;
// 		}

// 		if (!valRes.ok) {
// 			tokenCache.delete(token); // token is expired/invalid
// 			return null;
// 		}

// 		// ── 3. Fetch fresh user profile ────────────────────────────────
// 		let profileRes: Response;
// 		try {
// 			profileRes = await timedFetch(ME_ENDPOINT, {
// 				headers: { Authorization: `Bearer ${token}` }
// 			});
// 		} catch {
// 			return null;
// 		}

// 		if (!profileRes.ok) return null;

// 		const profile = await profileRes.json();
// 		const user    = mapProfileToUser(profile, token);

// 		tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
// 		return user;
// 	} catch {
// 		return null; // never crash the hooks handler
// 	}
// }

// // Prune expired cache entries every 15 minutes
// setInterval(() => {
// 	const now = Date.now();
// 	for (const [k, v] of tokenCache.entries()) {
// 		if (now > v.expiresAt) tokenCache.delete(k);
// 	}
// }, 15 * 60_000);


import { env } from '$env/dynamic/private';

const WP_URL            = 'https://gartenwoche.ch/wp-json';
const JWT_ENDPOINT      = env.WP_JWT_AUTH_URL ?? `${WP_URL}/jwt-auth/v1/token`;
const VALIDATE_ENDPOINT = `${WP_URL}/jwt-auth/v1/token/validate`;
const ME_ENDPOINT       = `${WP_URL}/wp/v2/users/me`;
const AUTH_TIMEOUT_MS   = 8_000;

const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// ── Startup log ───────────────────────────────────────────────────────────────
console.log('[AUTH] auth.ts loaded');
console.log('[AUTH] JWT_ENDPOINT     :', JWT_ENDPOINT);
console.log('[AUTH] VALIDATE_ENDPOINT:', VALIDATE_ENDPOINT);
console.log('[AUTH] ME_ENDPOINT      :', ME_ENDPOINT);
console.log('[AUTH] PRO_ROLES        :', PRO_ROLES.join(', '));

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
	const user = {
		id:       profile.id                    as number,
		username: profile.slug                  as string,
		name:     profile.name                  as string,
		email:    (profile.email ?? '')         as string,
		avatar:   (profile.avatar_urls?.['96'] ?? '') as string,
		roles:    (profile.roles ?? [])         as string[],
		isPro:    (profile.roles ?? []).some((r: string) => PRO_ROLES.includes(r)),
		token
	};
	console.log('[AUTH] mapProfileToUser →', {
		id:       user.id,
		username: user.username,
		email:    user.email,
		roles:    user.roles,
		isPro:    user.isPro
	});
	return user;
}

/** Fetch with hard timeout. Returns the Response regardless of status. */
async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
	console.log('[AUTH] timedFetch →', init?.method ?? 'GET', url);
	const ctrl  = new AbortController();
	const timer = setTimeout(() => {
		console.warn('[AUTH] timedFetch TIMEOUT after', AUTH_TIMEOUT_MS, 'ms →', url);
		ctrl.abort();
	}, AUTH_TIMEOUT_MS);
	try {
		const res = await fetch(url, { ...init, signal: ctrl.signal });
		clearTimeout(timer);
		console.log('[AUTH] timedFetch ←', res.status, res.statusText, url);
		return res;
	} catch (err) {
		clearTimeout(timer);
		console.error('[AUTH] timedFetch ERROR:', err, url);
		throw err;
	}
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Authenticate against WordPress JWT Auth plugin.
 * Returns full user object including token.
 * Throws on invalid credentials or network error.
 */
export async function loginWithWordPress(username: string, password: string) {
	console.log('[AUTH] loginWithWordPress called for username:', username);

	// ── Step 1: Get JWT token ─────────────────────────────────────────
	console.log('[AUTH] Step 1: Requesting JWT token from WordPress...');
	let jwtRes: Response;
	try {
		jwtRes = await timedFetch(JWT_ENDPOINT, {
			method:  'POST',
			headers: { 'Content-Type': 'application/json' },
			body:    JSON.stringify({ username, password })
		});
	} catch {
		console.error('[AUTH] ❌ WordPress server unreachable at', JWT_ENDPOINT);
		throw new Error('WordPress-Server nicht erreichbar. Bitte später versuchen.');
	}

	if (!jwtRes.ok) {
		const err = await jwtRes.json().catch(() => ({}));
		console.warn('[AUTH] ❌ JWT token request failed:', jwtRes.status, err);
		throw new Error(err.message || 'Ungültige Zugangsdaten');
	}

	const data  = await jwtRes.json();
	const token = data.token as string;
	if (!token) {
		console.error('[AUTH] ❌ JWT response OK but no token in body:', data);
		throw new Error('Kein Token empfangen');
	}
	console.log('[AUTH] ✅ Step 1 complete: JWT token received');

	// ── Step 2: Fetch user profile ────────────────────────────────────
	console.log('[AUTH] Step 2: Fetching user profile from', ME_ENDPOINT);
	let profileRes: Response;
	try {
		profileRes = await timedFetch(ME_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` }
		});
	} catch {
		console.error('[AUTH] ❌ Could not reach ME_ENDPOINT:', ME_ENDPOINT);
		throw new Error('Benutzerprofil konnte nicht geladen werden');
	}

	if (!profileRes.ok) {
		console.warn('[AUTH] ❌ Profile fetch failed:', profileRes.status, profileRes.statusText);
		throw new Error('Benutzerprofil konnte nicht geladen werden');
	}

	const profile = await profileRes.json();
	console.log('[AUTH] ✅ Step 2 complete: profile fetched for id', profile.id);

	// ── Step 3: Map + cache ───────────────────────────────────────────
	console.log('[AUTH] Step 3: Mapping profile and warming cache...');
	const user = mapProfileToUser(profile, token);
	tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });

	console.log('[AUTH] ✅ Login successful!');
	console.log('[AUTH]    ID       :', user.id);
	console.log('[AUTH]    Username :', user.username);
	console.log('[AUTH]    Email    :', user.email);
	console.log('[AUTH]    Roles    :', user.roles.join(', '));
	console.log('[AUTH]    isPro    :', user.isPro);
	console.log('[AUTH]    Cache    : token stored, expires in', CACHE_TTL / 60000, 'min');

	return user;
}

/**
 * Validate a JWT cookie token and return the user.
 * Uses in-process cache to avoid WP API calls on every request.
 * Returns null if token is invalid, expired, or WP unreachable.
 */
export async function validateToken(token: string) {
	console.log('[AUTH] validateToken called, token length:', token?.length ?? 0);
	try {
		// ── 1. Cache hit ───────────────────────────────────────────────
		const cached = tokenCache.get(token);
		if (cached && Date.now() < cached.expiresAt) {
			const remainingMin = Math.round((cached.expiresAt - Date.now()) / 60000);
			console.log('[AUTH] ✅ Cache hit for user:', cached.user.username, '| expires in', remainingMin, 'min');
			return cached.user;
		}
		console.log('[AUTH] Cache miss — validating token with WordPress...');

		// ── 2. Validate JWT with WordPress ─────────────────────────────
		console.log('[AUTH] Step 1: Validating JWT signature at', VALIDATE_ENDPOINT);
		let valRes: Response;
		try {
			valRes = await timedFetch(VALIDATE_ENDPOINT, {
				method:  'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch {
			console.warn('[AUTH] ⚠️  WordPress unreachable during token validation — failing gracefully');
			tokenCache.delete(token);
			return null;
		}

		if (!valRes.ok) {
			console.warn('[AUTH] ❌ Token invalid/expired, status:', valRes.status);
			tokenCache.delete(token);
			return null;
		}
		console.log('[AUTH] ✅ Step 1 complete: token signature valid');

		// ── 3. Fetch fresh profile ─────────────────────────────────────
		console.log('[AUTH] Step 2: Fetching fresh profile from', ME_ENDPOINT);
		let profileRes: Response;
		try {
			profileRes = await timedFetch(ME_ENDPOINT, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch {
			console.error('[AUTH] ❌ Could not fetch profile during token validation');
			return null;
		}

		if (!profileRes.ok) {
			console.warn('[AUTH] ❌ Profile fetch failed during validation:', profileRes.status);
			return null;
		}

		const profile = await profileRes.json();
		console.log('[AUTH] ✅ Step 2 complete: fresh profile for id', profile.id);

		const user = mapProfileToUser(profile, token);
		tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
		console.log('[AUTH] ✅ validateToken complete, cache refreshed for:', user.username);

		return user;
	} catch (err) {
		console.error('[AUTH] ❌ Unexpected error in validateToken:', err);
		return null;
	}
}

// Prune expired cache entries every 15 minutes
setInterval(() => {
	const now     = Date.now();
	let   pruned  = 0;
	for (const [k, v] of tokenCache.entries()) {
		if (now > v.expiresAt) {
			tokenCache.delete(k);
			pruned++;
		}
	}
	if (pruned > 0) {
		console.log('[AUTH] Cache pruned:', pruned, 'expired entries removed,', tokenCache.size, 'remaining');
	}
}, 15 * 60_000);

/**
 * Remove a specific token from the server cache.
 * Called on logout so the next user gets fresh data immediately.
 */
export function clearUserCache(token: string): void {
	const had = tokenCache.has(token);
	tokenCache.delete(token);
	console.log('[AUTH] clearUserCache:', had ? '✅ token removed' : '⚠️ token was not in cache', '| cache size now:', tokenCache.size);
}