// /**
//  * Serverless-safe in-memory user store.
//  *
//  * For a clone/demo deployment this is sufficient — Vercel functions
//  * share process memory within a single instance.
//  *
//  * For production with persistent users: swap the Map for
//  * a Supabase/Neon/PlanetScale call using the same interface.
//  */

// import bcrypt from 'bcryptjs';

// export interface StoredUser {
// 	id: string;
// 	username: string;
// 	email: string;
// 	passwordHash: string;
// 	name: string;
// 	tier: 'free' | 'pro';
// 	createdAt: string; // ISO string
// }

// // In-memory store — survives the request lifetime; resets on cold start
// const users = new Map<string, StoredUser>();

// // ── Read helpers ─────────────────────────────────────────────────────────────

// export function findByEmail(email: string): StoredUser | undefined {
// 	for (const u of users.values()) {
// 		if (u.email.toLowerCase() === email.toLowerCase()) return u;
// 	}
// 	return undefined;
// }

// export function findById(id: string): StoredUser | undefined {
// 	return users.get(id);
// }

// export function findByUsername(username: string): StoredUser | undefined {
// 	for (const u of users.values()) {
// 		if (u.username.toLowerCase() === username.toLowerCase()) return u;
// 	}
// 	return undefined;
// }

// // ── Write helpers ─────────────────────────────────────────────────────────────

// export async function createUser(
// 	data: Pick<StoredUser, 'email' | 'username' | 'name'> & { password: string }
// ): Promise<StoredUser> {
// 	if (findByEmail(data.email)) throw new Error('EMAIL_EXISTS');
// 	if (findByUsername(data.username)) throw new Error('USERNAME_EXISTS');

// 	const passwordHash = await bcrypt.hash(data.password, 12);
// 	const user: StoredUser = {
// 		id: crypto.randomUUID(),
// 		email: data.email,
// 		username: data.username,
// 		name: data.name || data.username,
// 		passwordHash,
// 		tier: 'free',
// 		createdAt: new Date().toISOString()
// 	};
// 	users.set(user.id, user);
// 	return user;
// }

// export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
// 	return bcrypt.compare(password, user.passwordHash);
// }


/**
 * WordPress-backed user store.
 *
 * All users are created and looked up via the WordPress REST API.
 * Requires:
 *   WP_URL              — e.g. https://gartenwoche.ch
 *   WP_ADMIN_USER       — WordPress admin username
 *   WP_ADMIN_APP_PASS   — Application Password (spaces stripped automatically)
 *                         Generate: WP Admin → Users → Profile → Application Passwords
 */

import bcrypt from 'bcryptjs';
import { env } from '$env/dynamic/private';

// ── Env vars ─────────────────────────────────────────────────────────────────

const WP_URL        = env.WP_URL                                    ?? 'https://gartenwoche.ch';
const WP_ADMIN_USER = env.WP_ADMIN_USER                             ?? '';
const WP_ADMIN_PASS = (env.WP_ADMIN_APP_PASS ?? '').replace(/\\s/g, '');

const WP_API        = `${WP_URL}/wp-json/wp/v2`;
const AUTH_HEADER   = 'Basic ' + btoa(`${WP_ADMIN_USER}:${WP_ADMIN_PASS}`);

// ── Startup check ─────────────────────────────────────────────────────────────
console.log('[AUTH] users.ts loaded');
console.log('[AUTH] WP_URL      :', WP_URL);
console.log('[AUTH] WP_API      :', WP_API);
console.log('[AUTH] Admin user  :', WP_ADMIN_USER || '⚠️  NOT SET');
console.log('[AUTH] App password:', WP_ADMIN_PASS ? '✓ set' : '⚠️  NOT SET');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoredUser {
	id: string;
	username: string;
	email: string;
	passwordHash: string;   // stored in WP user meta field "gw_password_hash"
	name: string;
	tier: 'free' | 'pro';  // stored in WP user meta field "gw_tier"
	createdAt: string;      // ISO string — from WP registered date
}

/** Shape returned by WP REST API /users endpoint */
interface WpUserResponse {
	id: number;
	username: string;
	name: string;
	email?: string;            // only visible to admins
	registered_date?: string;
	meta?: {
		gw_password_hash?: string | string[];
		gw_tier?: string | string[];
	};
}

// ── Low-level WP helpers ──────────────────────────────────────────────────────

async function wpGet<T>(endpoint: string): Promise<T | null> {
	const url = `${WP_API}${endpoint}`;
	console.log('[WP GET]', url);
	try {
		const res = await fetch(url, {
			headers: {
				'Authorization': AUTH_HEADER,
				'Accept':        'application/json'
			}
		});
		if (!res.ok) {
			console.warn('[WP GET] Failed:', res.status, res.statusText, url);
			return null;
		}
		console.log('[WP GET] OK:', res.status, url);
		return res.json() as Promise<T>;
	} catch (err) {
		console.error('[WP GET] Network error:', err, url);
		return null;
	}
}

async function wpPost<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
	const url = `${WP_API}${endpoint}`;
	console.log('[WP POST]', url, '| payload keys:', Object.keys(body).join(', '));
	const res = await fetch(url, {
		method:  'POST',
		headers: {
			'Authorization': AUTH_HEADER,
			'Content-Type':  'application/json',
			'Accept':        'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({})) as { code?: string; message?: string };
		console.error('[WP POST] Error:', res.status, err.code, err.message);
		if (err.code === 'existing_user_email' || err.code === 'existing_user_login') {
			throw new Error('EMAIL_EXISTS');
		}
		throw new Error(err.message ?? `WP API error ${res.status}`);
	}

	console.log('[WP POST] OK:', res.status, url);
	return res.json() as Promise<T>;
}

// ── Map WP response → StoredUser ─────────────────────────────────────────────

function mapWpUser(wp: WpUserResponse): StoredUser {
	// Meta values can come back as array or string depending on WP version
	const pick = (v: string | string[] | undefined) =>
		Array.isArray(v) ? (v[0] ?? '') : (v ?? '');

	return {
		id:           String(wp.id),
		username:     wp.username,
		name:         wp.name,
		email:        wp.email ?? '',
		passwordHash: pick(wp.meta?.gw_password_hash),
		tier:         (pick(wp.meta?.gw_tier) as 'free' | 'pro') || 'free',
		createdAt:    wp.registered_date ?? new Date().toISOString()
	};
}

// ── Read helpers ──────────────────────────────────────────────────────────────

/**
 * Find a user by email address.
 * Uses the WP admin-only `?search=` param which matches email + username.
 */
export async function findByEmail(email: string): Promise<StoredUser | undefined> {
	console.log('[AUTH] findByEmail called for:', email);
	const results = await wpGet<WpUserResponse[]>(
		`/users?search=${encodeURIComponent(email)}&context=edit`
	);
	if (!results?.length) {
		console.log('[AUTH] findByEmail: no results found for', email);
		return undefined;
	}
	const match = results.find(
		(u) => u.email?.toLowerCase() === email.toLowerCase()
	);
	if (match) {
		console.log('[AUTH] findByEmail: found user id', match.id, 'for', email);
	} else {
		console.log('[AUTH] findByEmail: no exact match for', email);
	}
	return match ? mapWpUser(match) : undefined;
}

export async function findById(id: string): Promise<StoredUser | undefined> {
	const user = await wpGet<WpUserResponse>(`/users/${id}?context=edit`);
	return user ? mapWpUser(user) : undefined;
}

export async function findByUsername(username: string): Promise<StoredUser | undefined> {
	const results = await wpGet<WpUserResponse[]>(
		`/users?search=${encodeURIComponent(username)}&context=edit`
	);
	if (!results?.length) return undefined;
	const match = results.find(
		(u) => u.username?.toLowerCase() === username.toLowerCase()
	);
	return match ? mapWpUser(match) : undefined;
}

// ── Write helpers ─────────────────────────────────────────────────────────────

export async function createUser(
	data: Pick<StoredUser, 'email' | 'username' | 'name'> & { password: string }
): Promise<StoredUser> {
	console.log('[AUTH] createUser called for:', data.email, '| username:', data.username);

	console.log('[AUTH] Hashing password...');
	const passwordHash = await bcrypt.hash(data.password, 12);
	console.log('[AUTH] Password hashed ✓');

	console.log('[AUTH] Sending user to WordPress REST API...');
	const wp = await wpPost<WpUserResponse>('/users', {
		username: data.username,
		email:    data.email,
		name:     data.name || data.username,
		password: data.password,
		roles:    ['subscriber'],
		meta: {
			gw_password_hash: passwordHash,
			gw_tier:          'free'
		}
	});

	const user = mapWpUser(wp);
	console.log(`[AUTH] ✅ User registered successfully!`);
	console.log(`[AUTH]    WP ID    : ${user.id}`);
	console.log(`[AUTH]    Username : ${user.username}`);
	console.log(`[AUTH]    Email    : ${user.email}`);
	console.log(`[AUTH]    Tier     : ${user.tier}`);
	console.log(`[AUTH]    Created  : ${user.createdAt}`);

	return user;
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
	console.log('[AUTH] verifyPassword called for user id:', user.id);
	if (!user.passwordHash) {
		console.warn('[AUTH] verifyPassword: no password hash stored for user', user.id);
		return false;
	}
	const ok = await bcrypt.compare(password, user.passwordHash);
	console.log('[AUTH] verifyPassword result:', ok ? '✅ match' : '❌ mismatch');
	return ok;
}