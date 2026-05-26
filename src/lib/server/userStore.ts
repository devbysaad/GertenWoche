/**
 * Per-user profile + billing storage.
 *
 * We can't write to /wp/v2/users/me right now (the upstream jwt-auth/v1 plugin
 * is misconfigured — returns 403 jwt_auth_bad_config — so any bearer-token
 * PATCH against it fails). As a working substitute we persist the fields
 * the user edits to a local JSON file keyed by their WP user id.
 *
 * Storage locations, in order of preference:
 *   1. process.env.USER_PROFILES_FILE                (explicit override)
 *   2. ./data/user-profiles.json                     (local dev — gitignored)
 *   3. <os.tmpdir()>/gw-user-profiles.json           (read-only-fs fallback,
 *                                                     e.g. Vercel serverless)
 *
 * On serverless platforms the /tmp file does not survive cold starts, so
 * persistence is best-effort. When the upstream WP plugin is fixed, swap
 * this whole module for a thin /wp/v2/users/me adapter — the public
 * function signatures here stay identical.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

// ── Persisted shape ────────────────────────────────────────────────────────

export interface UserProfile {
	firstName?: string;
	lastName?: string;
	displayName?: string;
	email?: string;
	bio?: string;
}

export interface UserBilling {
	firstName?: string;
	lastName?: string;
	company?: string;
	vat?: string;
	address?: string;
	country?: string;
	city?: string;
	district?: string;
	postal?: string;
	phone?: string;
	email?: string;
}

export interface UserRecord {
	profile: UserProfile;
	billing: UserBilling;
	updatedAt: string;
}

interface StoreShape {
	version: 1;
	users: Record<string, UserRecord>;
}

// ── File path resolution ───────────────────────────────────────────────────

function resolveStorePath(): string {
	if (process.env.USER_PROFILES_FILE) return process.env.USER_PROFILES_FILE;

	// Try project-local data/ first. cwd() in `vite dev` is the project root;
	// on Vercel it's typically /var/task which is read-only.
	const projectPath = join(process.cwd(), 'data', 'user-profiles.json');
	try {
		const dir = dirname(projectPath);
		if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
		// Touch-test write access
		if (!existsSync(projectPath)) writeFileSync(projectPath, JSON.stringify({ version: 1, users: {} }, null, 2));
		return projectPath;
	} catch {
		const tmpPath = join(tmpdir(), 'gw-user-profiles.json');
		try {
			if (!existsSync(tmpPath)) writeFileSync(tmpPath, JSON.stringify({ version: 1, users: {} }, null, 2));
		} catch {
			// Last resort: still return the path; reads/writes below will no-op gracefully.
		}
		return tmpPath;
	}
}

let CACHED_PATH: string | null = null;
function getPath(): string {
	if (CACHED_PATH) return CACHED_PATH;
	CACHED_PATH = resolveStorePath();
	return CACHED_PATH;
}

// ── Low-level I/O ──────────────────────────────────────────────────────────

function readStore(): StoreShape {
	try {
		const raw = readFileSync(getPath(), 'utf8');
		const parsed = JSON.parse(raw) as Partial<StoreShape>;
		if (parsed && typeof parsed === 'object' && parsed.users) {
			return { version: 1, users: parsed.users as Record<string, UserRecord> };
		}
	} catch {
		// Missing file or malformed JSON → start fresh.
	}
	return { version: 1, users: {} };
}

function writeStore(store: StoreShape): void {
	try {
		writeFileSync(getPath(), JSON.stringify(store, null, 2));
	} catch (err) {
		console.warn('[userStore] write failed:', (err as Error)?.message);
	}
}

function emptyRecord(): UserRecord {
	return { profile: {}, billing: {}, updatedAt: new Date(0).toISOString() };
}

// ── Public API ─────────────────────────────────────────────────────────────

export function loadUserData(userId: number | string): UserRecord {
	const id = String(userId);
	const store = readStore();
	return store.users[id] ?? emptyRecord();
}

export function saveProfile(userId: number | string, patch: UserProfile): UserRecord {
	const id = String(userId);
	const store = readStore();
	const current = store.users[id] ?? emptyRecord();
	const merged: UserRecord = {
		...current,
		profile: { ...current.profile, ...stripEmpty(patch) },
		updatedAt: new Date().toISOString()
	};
	store.users[id] = merged;
	writeStore(store);
	return merged;
}

export function saveBilling(userId: number | string, patch: UserBilling): UserRecord {
	const id = String(userId);
	const store = readStore();
	const current = store.users[id] ?? emptyRecord();
	const merged: UserRecord = {
		...current,
		billing: { ...current.billing, ...stripEmpty(patch) },
		updatedAt: new Date().toISOString()
	};
	store.users[id] = merged;
	writeStore(store);
	return merged;
}

/** Trim strings and drop keys whose value is an empty string. */
function stripEmpty<T extends object>(obj: T): Partial<T> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj ?? {})) {
		if (typeof v === 'string') {
			const trimmed = v.trim();
			if (trimmed !== '') out[k] = trimmed;
		} else if (v !== undefined && v !== null) {
			out[k] = v;
		}
	}
	return out as Partial<T>;
}
