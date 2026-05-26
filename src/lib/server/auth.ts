import { createHash } from 'node:crypto';
import { env } from '$env/dynamic/private';

// ── WordPress endpoints ──────────────────────────────────────────────────────
//
// We authenticate against the HeadlessKey plugin
// (https://gartenwoche.ch/wp-json/headlesskey/v1/*) which returns a JWT
// *together with the full user object* on its `/token` endpoint. We don't
// touch `/wp/v2/users/me` because that route is gated by the legacy JWT-Auth
// plugin on this server, which is misconfigured (no `JWT_AUTH_SECRET_KEY` in
// wp-config.php) and would return `jwt_auth_bad_config`.
//
// The public function signatures (`loginWithWordPress`, `validateToken`,
// `clearUserCache`) are unchanged so `hooks.server.ts`, the `/api/auth/*`
// routes and the in-memory token cache all keep working without changes.
const HEADLESSKEY_BASE  = env.WP_HEADLESSKEY_BASE ?? 'https://gartenwoche.ch/wp-json/headlesskey/v1';

const LOGIN_ENDPOINT    = `${HEADLESSKEY_BASE}/token`;
const VALIDATE_ENDPOINT = `${HEADLESSKEY_BASE}/token/validate`;
const REFRESH_ENDPOINT  = `${HEADLESSKEY_BASE}/token/refresh`;

const AUTH_TIMEOUT_MS   = 12_000;

const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// ── Server-side token cache (TTL: 10 min) ────────────────────────────────────
interface AuthUser {
	id: number;
	username: string;
	name: string;
	email: string;
	avatar: string;
	roles: string[];
	isPro: boolean;
	token: string;
}

interface CacheEntry {
	user: AuthUser;
	expiresAt: number;
}

const tokenCache = new Map<string, CacheEntry>();
const CACHE_TTL  = 10 * 60_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Gravatar URL from a (possibly empty) email. Falls back to a generic mp icon. */
function gravatarUrl(email: string | undefined | null, size = 96): string {
	const trimmed = (email ?? '').trim().toLowerCase();
	const hash = trimmed
		? createHash('md5').update(trimmed).digest('hex')
		: '00000000000000000000000000000000';
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}

/**
 * HeadlessKey `/token` response shape (excerpt — the plugin returns more
 * fields like jti, expiration, refreshable, etc., but we only need these).
 */
interface HeadlessKeyTokenResponse {
	token?: string;
	expiration?: string;
	user?: {
		ID?: number;
		user_login?: string;
		user_nicename?: string;
		user_email?: string;
		display_name?: string;
		roles?: string[];
		avatar_urls?: Record<string, string>;
	};
}

interface HeadlessKeyValidateResponse {
	valid?: boolean;
	expires_at?: number;
	data?: {
		ID?: number;
		user_login?: string;
		[key: string]: unknown;
	};
}

function buildUser(payload: HeadlessKeyTokenResponse, token: string): AuthUser {
	const u    = payload.user ?? {};
	const roles = Array.isArray(u.roles) ? u.roles : [];
	const email = u.user_email ?? '';
	return {
		id:       u.ID ?? 0,
		username: u.user_login ?? u.user_nicename ?? '',
		name:     u.display_name ?? u.user_login ?? '',
		email,
		avatar:   u.avatar_urls?.['96'] ?? gravatarUrl(email, 96),
		roles,
		isPro:    roles.some((r) => PRO_ROLES.includes(r)),
		token
	};
}

/**
 * Decode (without verifying) the JWT payload so we can recover the user id
 * and login when the in-memory cache has been wiped (e.g. server restarted
 * but the user still has a valid cookie). The signature is irrelevant here
 * because we always cross-check the token with `/token/validate` before
 * trusting anything.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
	const parts = token.split('.');
	if (parts.length < 2) return null;
	try {
		const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
		const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
		const json    = Buffer.from(padded + padding, 'base64').toString('utf-8');
		return JSON.parse(json);
	} catch {
		return null;
	}
}

/**
 * Build a minimal user object purely from data we can recover after a cache
 * miss: the JWT payload + the `/token/validate` response. We won't have
 * email or roles in this path, so `isPro` is false and the avatar falls back
 * to a generic gravatar. Use this only when the cookie is valid but we
 * never saw the actual login response.
 */
function buildMinimalUserFromToken(
	token: string,
	validate: HeadlessKeyValidateResponse
): AuthUser {
	const payload = decodeJwtPayload(token) as
		| { data?: { user?: { id?: number | string }, ID?: number | string } }
		| null;

	const idFromPayload =
		payload?.data?.user?.id ??
		payload?.data?.ID ??
		validate.data?.ID ??
		0;
	const id = typeof idFromPayload === 'string' ? Number(idFromPayload) : idFromPayload;

	const username = validate.data?.user_login ?? '';

	return {
		id:       Number.isFinite(id) ? Number(id) : 0,
		username,
		name:     username,
		email:    '',
		avatar:   gravatarUrl('', 96),
		roles:    [],
		isPro:    false,
		token
	};
}

/**
 * Sentinel error so callers (and the auth modal) can distinguish a network
 * problem from a credential rejection from a misconfigured server.
 */
class AuthError extends Error {
	constructor(message: string, readonly kind: 'timeout' | 'network' | 'credentials' | 'server') {
		super(message);
		this.name = 'AuthError';
	}
}

/** fetch() with a hard timeout. Throws an `AuthError` on timeout/network failure. */
async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
	const ctrl  = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), AUTH_TIMEOUT_MS);
	try {
		const res = await fetch(url, { ...init, signal: ctrl.signal });
		clearTimeout(timer);
		return res;
	} catch (err) {
		clearTimeout(timer);
		const aborted =
			err instanceof Error &&
			(err.name === 'AbortError' || err.message.toLowerCase().includes('aborted'));
		throw new AuthError(
			aborted
				? 'WordPress reagiert zu langsam. Bitte später erneut versuchen.'
				: 'WordPress-Server nicht erreichbar. Bitte später versuchen.',
			aborted ? 'timeout' : 'network'
		);
	}
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Authenticate against the WordPress HeadlessKey plugin and return the full
 * user object including the bearer token. The user object is built straight
 * from the `/token` response — we do NOT call `/wp/v2/users/me`.
 *
 * Throws an `AuthError` whose `kind` is one of:
 *   - 'timeout'      → request was aborted by AUTH_TIMEOUT_MS
 *   - 'network'      → fetch() rejected (DNS, TLS, offline …)
 *   - 'credentials'  → WordPress rejected the username/password
 *   - 'server'       → WordPress returned an unexpected error
 */
export async function loginWithWordPress(username: string, password: string): Promise<AuthUser> {
	const tokenRes = await timedFetch(LOGIN_ENDPOINT, {
		method:  'POST',
		headers: { 'Content-Type': 'application/json' },
		body:    JSON.stringify({ username, password })
	});

	if (!tokenRes.ok) {
		const err = await tokenRes.json().catch(() => ({} as { code?: string; message?: string }));
		if (
			tokenRes.status === 401 ||
			err.code === 'invalid_credentials' ||
			err.code === 'invalid_email' ||
			err.code === 'incorrect_password'
		) {
			throw new AuthError('Ungültige Zugangsdaten.', 'credentials');
		}
		if (tokenRes.status >= 500) {
			throw new AuthError(err.message || 'WordPress-Server hat einen Fehler gemeldet.', 'server');
		}
		throw new AuthError(
			err.message || `Anmeldung fehlgeschlagen (HTTP ${tokenRes.status})`,
			'server'
		);
	}

	const data = (await tokenRes.json().catch(() => ({}))) as HeadlessKeyTokenResponse;
	const token = data.token;
	if (!token) {
		throw new AuthError('WordPress hat keinen Token geliefert.', 'server');
	}

	const user = buildUser(data, token);
	tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
	return user;
}

/**
 * Validate a bearer token (from the `wp_token` cookie) and return the user.
 *
 * 1. Cache hit       → return cached user (fast path)
 * 2. /token/validate → confirms the token is still good on WP
 *    - If we already have a cached user, refresh its TTL and return it
 *    - Otherwise build a minimal user from validate response + JWT payload
 *
 * Returns `null` if the token is invalid, expired or WP is unreachable —
 * never throws, so the request can continue rendering as a guest.
 */
export async function validateToken(token: string): Promise<AuthUser | null> {
	try {
		// ── 1. Cache hit ───────────────────────────────────────────────
		const cached = tokenCache.get(token);
		if (cached && Date.now() < cached.expiresAt) {
			return cached.user;
		}

		// ── 2. Ask the HeadlessKey plugin whether the token is still valid ──
		let valRes: Response;
		try {
			valRes = await timedFetch(VALIDATE_ENDPOINT, {
				method:  'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
		} catch {
			tokenCache.delete(token);
			return null;
		}

		if (!valRes.ok) {
			tokenCache.delete(token);
			return null;
		}

		const validateData = (await valRes.json().catch(() => ({}))) as HeadlessKeyValidateResponse;

		if (validateData.valid === false) {
			tokenCache.delete(token);
			return null;
		}

		// ── 3a. We still have a cached user (just expired) — re-use it ──
		if (cached?.user) {
			const refreshed: CacheEntry = {
				user: cached.user,
				expiresAt: Date.now() + CACHE_TTL
			};
			tokenCache.set(token, refreshed);
			return refreshed.user;
		}

		// ── 3b. Cold cache — rebuild from JWT payload + validate body ──
		const user = buildMinimalUserFromToken(token, validateData);
		tokenCache.set(token, { user, expiresAt: Date.now() + CACHE_TTL });
		return user;
	} catch {
		return null;
	}
}

/**
 * Remove a specific token from the server cache.
 * Called on logout so the next user gets fresh data immediately.
 */
export function clearUserCache(token: string): void {
	tokenCache.delete(token);
}

/**
 * Optional helper for the /api/auth/refresh route.
 * Exchanges an existing token for a new one via the HeadlessKey plugin.
 */
export async function refreshToken(token: string): Promise<string | null> {
	try {
		const res = await timedFetch(REFRESH_ENDPOINT, {
			method:  'POST',
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!res.ok) return null;
		const data = (await res.json().catch(() => ({}))) as { token?: string };
		if (!data.token) return null;

		// Move the cached user (if any) to the new token key.
		const cached = tokenCache.get(token);
		if (cached) {
			tokenCache.delete(token);
			tokenCache.set(data.token, {
				user: { ...cached.user, token: data.token },
				expiresAt: Date.now() + CACHE_TTL
			});
		}
		return data.token;
	} catch {
		return null;
	}
}

// Prune expired cache entries every 15 minutes
setInterval(() => {
	const now = Date.now();
	for (const [k, v] of tokenCache.entries()) {
		if (now > v.expiresAt) tokenCache.delete(k);
	}
}, 15 * 60_000);
