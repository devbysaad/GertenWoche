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
const WP_ADMIN_PASS = (env.WP_ADMIN_APP_PASS ?? '').replace(/\s/g, '');

const WP_API        = `${WP_URL}/wp-json/wp/v2`;
const AUTH_HEADER   = 'Basic ' + btoa(`${WP_ADMIN_USER}:${WP_ADMIN_PASS}`);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoredUser {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	name: string;
	tier: 'free' | 'pro';
	createdAt: string;
}

interface WpUserResponse {
	id: number;
	username: string;
	name: string;
	email?: string;
	registered_date?: string;
	meta?: {
		gw_password_hash?: string | string[];
		gw_tier?: string | string[];
	};
}

// ── Low-level WP helpers ──────────────────────────────────────────────────────

async function wpGet<T>(endpoint: string): Promise<T | null> {
	try {
		const res = await fetch(`${WP_API}${endpoint}`, {
			headers: {
				'Authorization': AUTH_HEADER,
				'Accept':        'application/json'
			}
		});
		if (!res.ok) return null;
		return res.json() as Promise<T>;
	} catch {
		return null;
	}
}

async function wpPost<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
	const res = await fetch(`${WP_API}${endpoint}`, {
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
		if (err.code === 'existing_user_email' || err.code === 'existing_user_login') {
			throw new Error('EMAIL_EXISTS');
		}
		throw new Error(err.message ?? `WP API error ${res.status}`);
	}

	return res.json() as Promise<T>;
}

// ── Map WP response → StoredUser ─────────────────────────────────────────────

function mapWpUser(wp: WpUserResponse): StoredUser {
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

export async function findByEmail(email: string): Promise<StoredUser | undefined> {
	const results = await wpGet<WpUserResponse[]>(
		`/users?search=${encodeURIComponent(email)}&context=edit`
	);
	if (!results?.length) return undefined;
	const match = results.find(
		(u) => u.email?.toLowerCase() === email.toLowerCase()
	);
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
	const passwordHash = await bcrypt.hash(data.password, 12);

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

	return mapWpUser(wp);
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
	if (!user.passwordHash) return false;
	return bcrypt.compare(password, user.passwordHash);
}