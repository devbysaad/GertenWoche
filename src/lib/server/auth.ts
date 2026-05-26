/**
 * Authentication against the gartenwoche.ch WordPress server,
 * routed exclusively through the HeadlessKey plugin.
 *
 * The standard jwt-auth/v1 plugin is misconfigured on the upstream server
 * (missing JWT_AUTH_SECRET_KEY in wp-config.php) and returns 403 on every
 * call, so it is deliberately NOT used. /wp/v2/users/me is similarly
 * blocked, so user details are read directly out of the HeadlessKey /token
 * response and (when refreshing on a cold cache) the JWT payload itself.
 *
 * All public functions:
 *   - never throw raw network errors at callers (they throw AuthError instead),
 *   - apply a hard 12s timeout (upstream WP can be slow),
 *   - return shapes typed against $lib/types/user.WPUser.
 */

import { createHash } from 'node:crypto';
import { env } from '$env/dynamic/private';
import type { WPUser } from '$lib/types/user';

// ─── Endpoints ────────────────────────────────────────────────────────────────

function getHeadlessKeyBase(): string {
	return (
		env.WP_HEADLESSKEY_BASE ??
		`${env.PUBLIC_WP_URL ?? 'https://gartenwoche.ch/wp-json'}/headlesskey/v1`
	).replace(/\/+$/, '');
}

const ENDPOINTS = {
	token:           () => `${getHeadlessKeyBase()}/token`,
	tokenValidate:   () => `${getHeadlessKeyBase()}/token/validate`,
	tokenRefresh:    () => `${getHeadlessKeyBase()}/token/refresh`,
	tokenRevoke:     () => `${getHeadlessKeyBase()}/token/revoke`,
	register:        () => `${getHeadlessKeyBase()}/register`,
	forgotPassword:  () => `${getHeadlessKeyBase()}/forgot-password`,
	resetPassword:   () => `${getHeadlessKeyBase()}/reset-password`,
	changePassword:  () => `${getHeadlessKeyBase()}/change-password`
};

// Upstream WordPress can take a while on the first /token call for a new user
// (mail hooks, plugin filters, etc.). 25s is generous but still bounded so a
// truly-stuck request doesn't hang the UI forever.
const AUTH_TIMEOUT_MS = 25_000;
const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

// ─── Error type ───────────────────────────────────────────────────────────────

export type AuthErrorKind =
	| 'timeout'
	| 'network'
	| 'credentials'
	| 'duplicate'
	| 'validation'
	| 'rate_limited'
	| 'server'
	| 'unknown';

export class AuthError extends Error {
	kind: AuthErrorKind;
	status: number;
	upstreamCode?: string;

	constructor(kind: AuthErrorKind, message: string, status = 500, upstreamCode?: string) {
		super(message);
		this.name = 'AuthError';
		this.kind = kind;
		this.status = status;
		this.upstreamCode = upstreamCode;
	}
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), AUTH_TIMEOUT_MS);
	try {
		return await fetch(url, { ...init, signal: ctrl.signal });
	} finally {
		clearTimeout(timer);
	}
}

/** Map an upstream HeadlessKey/WP error response into a typed AuthError. */
function mapUpstreamError(res: Response, body: any, defaultKind: AuthErrorKind = 'unknown'): AuthError {
	const code: string = body?.code ?? '';
	const message: string = body?.message ?? `Upstream error (HTTP ${res.status})`;
	const status = res.status;

	// HeadlessKey + WordPress error codes we know about
	const credentialsCodes = ['invalid_credentials', 'incorrect_password', 'invalid_username', 'invalid_email'];
	const duplicateCodes   = ['existing_user_email', 'existing_user_login', 'user_already_exists', 'email_exists', 'username_exists'];
	const validationCodes  = ['missing_fields', 'missing_token', 'invalid_email', 'weak_password', 'rest_invalid_param'];
	const rateLimitedCodes = ['too_many_attempts', 'rate_limited'];

	if (credentialsCodes.includes(code) || (status === 401 && defaultKind === 'credentials')) {
		return new AuthError('credentials', germanCredentialsMessage(code) ?? message, status, code);
	}
	if (duplicateCodes.includes(code) || status === 409) {
		return new AuthError('duplicate', germanDuplicateMessage(code) ?? message, status, code);
	}
	if (validationCodes.includes(code) || status === 400) {
		return new AuthError('validation', message, status, code);
	}
	if (rateLimitedCodes.includes(code) || status === 429) {
		return new AuthError(
			'rate_limited',
			'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.',
			status,
			code
		);
	}
	if (status >= 500) {
		return new AuthError('server', 'Der Server ist vorübergehend nicht erreichbar.', status, code);
	}
	return new AuthError(defaultKind, message, status, code);
}

function germanCredentialsMessage(code: string): string | null {
	switch (code) {
		case 'invalid_credentials':
		case 'incorrect_password':
			return 'Benutzername oder Passwort ist falsch.';
		case 'invalid_username':
			return 'Dieser Benutzername ist ungültig.';
		case 'invalid_email':
			return 'Diese E-Mail-Adresse ist ungültig.';
		default:
			return null;
	}
}

function germanDuplicateMessage(code: string): string | null {
	switch (code) {
		case 'existing_user_email':
		case 'email_exists':
			return 'Diese E-Mail-Adresse ist bereits registriert.';
		case 'existing_user_login':
		case 'username_exists':
		case 'user_already_exists':
			return 'Dieser Benutzername ist bereits vergeben.';
		default:
			return null;
	}
}

/** Decode (without verifying) the payload of a JWT. */
function decodeJwtPayload(token: string): Record<string, any> | null {
	try {
		const [, body] = token.split('.');
		if (!body) return null;
		const padded = body.padEnd(body.length + ((4 - (body.length % 4)) % 4), '=');
		const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
		const json = Buffer.from(b64, 'base64').toString('utf8');
		return JSON.parse(json);
	} catch {
		return null;
	}
}

/** SHA-256 Gravatar URL for the given email (Gravatar accepts both md5 + sha256). */
function gravatarUrl(email: string): string {
	const hash = createHash('sha256').update((email ?? '').trim().toLowerCase()).digest('hex');
	return `https://www.gravatar.com/avatar/${hash}?d=mp&s=128`;
}

/**
 * Pull a value from any of several possible field-name aliases.
 * HeadlessKey is not consistent: sometimes it returns `{ user: {...} }`,
 * sometimes flat fields like `user_email`, sometimes WP-style `email`.
 */
function pick<T = any>(obj: any, ...keys: string[]): T | undefined {
	if (!obj) return undefined;
	for (const k of keys) {
		const parts = k.split('.');
		let cur: any = obj;
		for (const p of parts) {
			cur = cur?.[p];
			if (cur === undefined) break;
		}
		if (cur !== undefined && cur !== null && cur !== '') return cur as T;
	}
	return undefined;
}

/**
 * Build a normalized WPUser from any subset of HeadlessKey response fields
 * + (optionally) the decoded JWT payload. All fields are best-effort —
 * we never error out on a missing optional field.
 */
function buildUser(token: string, body: any): WPUser {
	const jwt = decodeJwtPayload(token) ?? {};
	const jwtUser = (jwt?.data?.user ?? jwt?.user ?? {}) as Record<string, any>;
	const src = body ?? {};
	const u   = (src.user ?? src.data?.user ?? {}) as Record<string, any>;

	const idRaw =
		pick<number | string>(u, 'id', 'ID') ??
		pick<number | string>(src, 'user_id', 'userId', 'id', 'ID') ??
		pick<number | string>(jwtUser, 'id', 'ID') ??
		pick<number | string>(jwt, 'sub');
	const id = Number(idRaw ?? 0) || 0;

	const username =
		pick<string>(u, 'username', 'user_login', 'login', 'slug', 'nicename') ??
		pick<string>(src, 'user_login', 'username', 'user_nicename', 'login') ??
		pick<string>(jwtUser, 'username', 'user_login', 'login') ??
		'';

	const email =
		pick<string>(u, 'email', 'user_email') ??
		pick<string>(src, 'user_email', 'email') ??
		pick<string>(jwtUser, 'email', 'user_email') ??
		'';

	const firstName =
		pick<string>(u, 'first_name', 'firstName') ??
		pick<string>(src, 'first_name', 'firstName') ??
		'';

	const lastName =
		pick<string>(u, 'last_name', 'lastName') ??
		pick<string>(src, 'last_name', 'lastName') ??
		'';

	const displayName =
		pick<string>(u, 'display_name', 'displayName', 'name') ??
		pick<string>(src, 'user_display_name', 'display_name', 'displayName', 'name') ??
		([firstName, lastName].filter(Boolean).join(' ').trim() || username || '');

	const name = displayName || username || email || 'Benutzer';

	const rolesRaw =
		pick<string[] | string>(u, 'roles', 'role') ??
		pick<string[] | string>(src, 'user_roles', 'roles', 'role') ??
		pick<string[] | string>(jwtUser, 'roles', 'role') ??
		[];
	const roles: string[] = Array.isArray(rolesRaw)
		? rolesRaw.map((r) => String(r))
		: rolesRaw
			? [String(rolesRaw)]
			: [];

	const avatarFromUpstream =
		pick<string>(u, 'avatar_urls.96', 'avatar_urls.48', 'avatar_url', 'avatar') ??
		pick<string>(src, 'avatar_url', 'avatar') ??
		'';
	const avatar = avatarFromUpstream || (email ? gravatarUrl(email) : '');

	// `expiresAt` must be an absolute Unix timestamp (seconds). The JWT `exp`
	// claim is always epoch-seconds per RFC 7519, so prefer it. Some
	// HeadlessKey responses also include a top-level `exp` (epoch) — accept
	// that as a fallback. Crucially: `expires_in` is a *duration*, never an
	// absolute timestamp, and we never want to silently treat it as one
	// (that would disable the refresh-on-near-expiry logic in hooks).
	const jwtExp = Number(pick<number | string>(jwt, 'exp') ?? 0) || 0;
	const responseExpRaw = pick<number | string>(src, 'exp', 'token_expires', 'expires');
	const responseExp = Number(responseExpRaw ?? 0) || 0;
	// Treat anything < year 2001 (1_000_000_000) as a relative duration and
	// convert it to an absolute timestamp from "now".
	const isEpoch = (n: number) => n >= 1_000_000_000;
	let expiresAt = 0;
	if (jwtExp && isEpoch(jwtExp))           expiresAt = jwtExp;
	else if (responseExp && isEpoch(responseExp)) expiresAt = responseExp;
	else if (responseExp)                    expiresAt = Math.floor(Date.now() / 1000) + responseExp;
	else if (jwtExp)                         expiresAt = jwtExp;

	return {
		id,
		username,
		name,
		displayName,
		firstName,
		lastName,
		email,
		avatar,
		roles,
		isPro: roles.some((r) => PRO_ROLES.includes(r)),
		token,
		expiresAt
	};
}

// ─── Token cache (per-instance) ───────────────────────────────────────────────

interface CacheEntry {
	user: WPUser;
	validUntil: number; // local-clock ms
}
const tokenCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60_000;

function cacheSet(token: string, user: WPUser): void {
	tokenCache.set(token, { user, validUntil: Date.now() + CACHE_TTL_MS });
}

function cacheGet(token: string): WPUser | null {
	const e = tokenCache.get(token);
	if (!e) return null;
	if (Date.now() > e.validUntil) {
		tokenCache.delete(token);
		return null;
	}
	return e.user;
}

setInterval(() => {
	const now = Date.now();
	for (const [k, v] of tokenCache.entries()) {
		if (now > v.validUntil) tokenCache.delete(k);
	}
}, 15 * 60_000);

// ─── Public API ───────────────────────────────────────────────────────────────

/** Log in a user against HeadlessKey /token. Throws AuthError on failure. */
export async function loginWithWordPress(username: string, password: string): Promise<WPUser> {
	let res: Response;
	try {
		res = await timedFetch(ENDPOINTS.token(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
	} catch (err: any) {
		if (err?.name === 'AbortError') {
			throw new AuthError(
				'timeout',
				'Der Anmelde-Server antwortet im Moment sehr langsam. Bitte versuchen Sie es in einigen Sekunden erneut.',
				504
			);
		}
		throw new AuthError('network', 'Verbindung zum Anmelde-Server fehlgeschlagen.', 502);
	}

	const body = await res.json().catch(() => ({}));

	if (!res.ok) throw mapUpstreamError(res, body, 'credentials');

	const token: string = body?.token ?? body?.jwt ?? body?.access_token ?? '';
	if (!token) {
		throw new AuthError('server', 'Anmeldeantwort enthielt kein Token. Bitte kontaktieren Sie den Administrator.');
	}

	const user = buildUser(token, body);
	cacheSet(token, user);
	return user;
}

/**
 * Validate a session token and return the WPUser, or null if invalid/unknown.
 *
 * Order of operations:
 *   1. Local cache hit → return immediately (no WP call).
 *   2. Upstream /token/validate → if 2xx, rebuild user from response + JWT
 *      payload, repopulate cache. If 4xx, treat as invalid.
 *   3. On network/timeout, return null so pages still render (we never block
 *      a SSR render on a flaky auth server).
 */
export async function validateToken(token: string): Promise<WPUser | null> {
	if (!token) return null;

	const cached = cacheGet(token);
	if (cached) return cached;

	let res: Response;
	try {
		res = await timedFetch(ENDPOINTS.tokenValidate(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ token })
		});
	} catch {
		return null;
	}

	if (!res.ok) {
		tokenCache.delete(token);
		return null;
	}

	const body = await res.json().catch(() => ({}));
	const user = buildUser(token, body);
	if (!user.id && !user.username) {
		tokenCache.delete(token);
		return null;
	}
	cacheSet(token, user);
	return user;
}

/**
 * Ask HeadlessKey to refresh a token. Returns the new WPUser (with the new
 * token in `user.token`) or throws AuthError on failure.
 */
export async function refreshWordPressToken(token: string): Promise<WPUser> {
	let res: Response;
	try {
		res = await timedFetch(ENDPOINTS.tokenRefresh(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ token })
		});
	} catch (err: any) {
		throw new AuthError(
			err?.name === 'AbortError' ? 'timeout' : 'network',
			'Sitzung konnte nicht aktualisiert werden.'
		);
	}

	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw mapUpstreamError(res, body, 'credentials');

	const newToken: string = body?.token ?? body?.jwt ?? body?.access_token ?? '';
	if (!newToken) throw new AuthError('server', 'Refresh-Antwort enthielt kein Token.');

	tokenCache.delete(token); // drop old cache entry
	const user = buildUser(newToken, body);
	cacheSet(newToken, user);
	return user;
}

/** Best-effort server-side revoke. Errors are swallowed — local cookie clear is the source of truth. */
export async function revokeWordPressToken(token: string): Promise<void> {
	if (!token) return;
	tokenCache.delete(token);
	try {
		await timedFetch(ENDPOINTS.tokenRevoke(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ token })
		});
	} catch {
		// ignore — local cookie removal is what actually logs the user out
	}
}

export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	displayName?: string;
}

/** Register a new WP user via HeadlessKey. Throws AuthError on failure. */
export async function registerWithWordPress(payload: RegisterPayload): Promise<WPUser> {
	const wpPayload: Record<string, unknown> = {
		username: payload.username,
		email: payload.email,
		password: payload.password
	};
	if (payload.firstName)   wpPayload.first_name   = payload.firstName;
	if (payload.lastName)    wpPayload.last_name    = payload.lastName;
	if (payload.displayName) wpPayload.display_name = payload.displayName;

	let res: Response;
	try {
		res = await timedFetch(ENDPOINTS.register(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(wpPayload)
		});
	} catch (err: any) {
		throw new AuthError(
			err?.name === 'AbortError' ? 'timeout' : 'network',
			'Verbindung zum Registrierungs-Server fehlgeschlagen.'
		);
	}

	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw mapUpstreamError(res, body, 'validation');

	// Some HeadlessKey configs return a token in the /register response;
	// others require a follow-up login. Try the response first.
	const token: string = body?.token ?? body?.jwt ?? body?.access_token ?? '';
	if (token) {
		const user = buildUser(token, body);
		cacheSet(token, user);
		return user;
	}

	// Fall back to issuing a /token call with the just-created credentials.
	return loginWithWordPress(payload.username, payload.password);
}

/** Request a password-reset email. Always resolves so callers can show a generic message. */
export async function requestPasswordReset(emailOrUsername: string): Promise<{ ok: boolean }> {
	try {
		const res = await timedFetch(ENDPOINTS.forgotPassword(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: emailOrUsername,
				username: emailOrUsername,
				user_login: emailOrUsername
			})
		});
		return { ok: res.ok };
	} catch {
		return { ok: false };
	}
}

/** Change password for the logged-in user. Returns new user (with new token if upstream rotated it). */
export async function changeWordPressPassword(
	token: string,
	currentPassword: string,
	newPassword: string
): Promise<WPUser> {
	let res: Response;
	try {
		res = await timedFetch(ENDPOINTS.changePassword(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				current_password: currentPassword,
				new_password: newPassword,
				password: newPassword // some configs use this name
			})
		});
	} catch (err: any) {
		throw new AuthError(
			err?.name === 'AbortError' ? 'timeout' : 'network',
			'Passwort konnte nicht geändert werden.'
		);
	}

	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw mapUpstreamError(res, body, 'credentials');

	const newToken: string = body?.token ?? body?.jwt ?? body?.access_token ?? token;
	const user = buildUser(newToken, body);
	if (newToken !== token) tokenCache.delete(token);
	cacheSet(newToken, user);
	return user;
}

/** Best-effort utility for the layout (avoids leaking token through to client). */
export function publicUser(user: WPUser | null): Omit<WPUser, 'token'> | null {
	if (!user) return null;
	const { token: _drop, ...safe } = user;
	return safe;
}

/** Time (ms) until the JWT in this user expires. 0 if unknown. */
export function msUntilExpiry(user: WPUser | null | undefined): number {
	if (!user?.expiresAt) return 0;
	return user.expiresAt * 1000 - Date.now();
}
