/**
 * Serverless-safe in-memory user store.
 *
 * For a clone/demo deployment this is sufficient — Vercel functions
 * share process memory within a single instance.
 *
 * For production with persistent users: swap the Map for
 * a Supabase/Neon/PlanetScale call using the same interface.
 */

import bcrypt from 'bcryptjs';

export interface StoredUser {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	name: string;
	tier: 'free' | 'pro';
	createdAt: string; // ISO string
}

// In-memory store — survives the request lifetime; resets on cold start
const users = new Map<string, StoredUser>();

// ── Read helpers ─────────────────────────────────────────────────────────────

export function findByEmail(email: string): StoredUser | undefined {
	for (const u of users.values()) {
		if (u.email.toLowerCase() === email.toLowerCase()) return u;
	}
	return undefined;
}

export function findById(id: string): StoredUser | undefined {
	return users.get(id);
}

export function findByUsername(username: string): StoredUser | undefined {
	for (const u of users.values()) {
		if (u.username.toLowerCase() === username.toLowerCase()) return u;
	}
	return undefined;
}

// ── Write helpers ─────────────────────────────────────────────────────────────

export async function createUser(
	data: Pick<StoredUser, 'email' | 'username' | 'name'> & { password: string }
): Promise<StoredUser> {
	if (findByEmail(data.email)) throw new Error('EMAIL_EXISTS');
	if (findByUsername(data.username)) throw new Error('USERNAME_EXISTS');

	const passwordHash = await bcrypt.hash(data.password, 12);
	const user: StoredUser = {
		id: crypto.randomUUID(),
		email: data.email,
		username: data.username,
		name: data.name || data.username,
		passwordHash,
		tier: 'free',
		createdAt: new Date().toISOString()
	};
	users.set(user.id, user);
	return user;
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
	return bcrypt.compare(password, user.passwordHash);
}
