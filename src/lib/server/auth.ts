const WP_URL = 'https://gartenwoche.ch/wp-json';
const JWT_ENDPOINT     = `${WP_URL}/jwt-auth/v1/token`;
const VALIDATE_ENDPOINT = `${WP_URL}/jwt-auth/v1/token/validate`;
const ME_ENDPOINT      = `${WP_URL}/wp/v2/users/me`;

const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// ── Server-side token cache (TTL: 5 min) ─────────────────────────────────────
// Avoids two WP API round-trips on every request. Cache is per-process so safe
// in serverless (cold starts wipe it automatically).
interface CacheEntry { user: ReturnType<typeof mapProfileToUser>; expiresAt: number }
const tokenCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function mapProfileToUser(profile: any, token: string) {
	return {
		id:       profile.id,
		username: profile.slug,
		name:     profile.name,
		email:    profile.email ?? '',
		avatar:   profile.avatar_urls?.['96'] ?? '',
		roles:    (profile.roles ?? []) as string[],
		isPro:    (profile.roles ?? []).some((r: string) => PRO_ROLES.includes(r)),
		token
	};
}

export async function loginWithWordPress(username: string, password: string) {
	const res = await fetch(JWT_ENDPOINT, {
		method:  'POST',
		headers: { 'Content-Type': 'application/json' },
		body:    JSON.stringify({ username, password })
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		// WP JWT returns { code, message, data } on error
		throw new Error(err.message || 'Login fehlgeschlagen');
	}

	const data  = await res.json();
	const token = data.token as string;

	const profileRes = await fetch(ME_ENDPOINT, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!profileRes.ok) throw new Error('Benutzerprofil konnte nicht geladen werden');

	const profile = await profileRes.json();
	const user    = mapProfileToUser(profile, token);

	// Warm the cache immediately after login
	tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL_MS });

	return user;
}

export async function validateToken(token: string) {
	try {
		// ── 1. Check in-process cache first ──────────────────────────────
		const cached = tokenCache.get(token);
		if (cached && Date.now() < cached.expiresAt) {
			return cached.user;
		}

		// ── 2. Validate the JWT signature with WP ──────────────────────
		const valRes = await fetch(VALIDATE_ENDPOINT, {
			method:  'POST',
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!valRes.ok) {
			tokenCache.delete(token); // evict stale entry
			return null;
		}

		// ── 3. Fetch fresh profile ────────────────────────────────────
		const profileRes = await fetch(ME_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!profileRes.ok) return null;

		const profile = await profileRes.json();
		const user    = mapProfileToUser(profile, token);

		// Cache for 5 min
		tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL_MS });
		return user;
	} catch {
		return null;
	}
}

// Prune expired cache entries every 10 minutes
setInterval(() => {
	const now = Date.now();
	for (const [k, v] of tokenCache.entries()) {
		if (now > v.expiresAt) tokenCache.delete(k);
	}
}, 10 * 60 * 1000);
