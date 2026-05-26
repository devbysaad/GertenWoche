/**
 * Per-user profile + billing store.
 *
 * Why this exists
 * ───────────────
 * The standard WordPress route for editable user fields is
 * `POST /wp/v2/users/me`, but the WP install at gartenwoche.ch has the
 * legacy `jwt-auth/v1` plugin enabled WITHOUT `JWT_AUTH_SECRET_KEY` defined
 * in wp-config.php. That filter intercepts every `Authorization: Bearer …`
 * request and rejects it with `jwt_auth_bad_config`, so HeadlessKey-issued
 * tokens cannot reach the user-update endpoint.
 *
 * Until the WP admin fixes wp-config.php (or removes the broken plugin),
 * this server-side JSON file is the source of truth for profile + billing
 * data. Reads and writes go through `loadUserData` / `saveProfile` /
 * `saveBilling`. The file lives in the repo's `data/` directory, keyed by
 * WordPress user id.
 *
 * The shape is plain, so swapping the implementation to call the WP REST API
 * later is a one-function change inside this module — the route handlers and
 * the page form don't need to know.
 *
 * Server-only: this module imports `node:fs`. Never import from a `.svelte`
 * file or any client-shared module.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { env } from '$env/dynamic/private';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProfileData {
	first_name: string;
	last_name: string;
	display_name: string;
	email: string;
}

export interface BillingData {
	first_name: string;
	last_name: string;
	company: string;
	vat: string;
	address: string;
	country: string;
	city: string;
	district: string;
	postal: string;
	phone: string;
	email: string;
}

export interface UserRecord {
	profile: ProfileData;
	billing: BillingData;
	updatedAt: string;
}

interface StoreShape {
	users: Record<string, UserRecord>;
}

const EMPTY_PROFILE: ProfileData = {
	first_name: '',
	last_name: '',
	display_name: '',
	email: ''
};

const EMPTY_BILLING: BillingData = {
	first_name: '',
	last_name: '',
	company: '',
	vat: '',
	address: '',
	country: '',
	city: '',
	district: '',
	postal: '',
	phone: '',
	email: ''
};

// ── Storage path ──────────────────────────────────────────────────────────────

const STORE_PATH = resolve(
	process.cwd(),
	env.USER_STORE_FILE ?? 'data/user-profiles.json'
);

// ── Low-level read / write ────────────────────────────────────────────────────

function readStore(): StoreShape {
	try {
		if (!existsSync(STORE_PATH)) return { users: {} };
		const raw = readFileSync(STORE_PATH, 'utf-8');
		if (!raw.trim()) return { users: {} };
		const parsed = JSON.parse(raw) as Partial<StoreShape>;
		return { users: parsed.users ?? {} };
	} catch (err) {
		console.warn('[userStore] failed to read store, starting empty:', err);
		return { users: {} };
	}
}

function writeStore(data: StoreShape): void {
	try {
		mkdirSync(dirname(STORE_PATH), { recursive: true });
		// Atomic write: write to temp then rename, so a crash mid-write doesn't
		// leave a half-written JSON file.
		const tmp = `${STORE_PATH}.tmp`;
		writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
		renameSync(tmp, STORE_PATH);
	} catch (err) {
		console.error('[userStore] failed to write store:', err);
		throw err;
	}
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Read the full record for one user, returning empty fields if none exists yet. */
export function loadUserData(userId: number | string): UserRecord {
	const key = String(userId);
	const store = readStore();
	const existing = store.users[key];
	return existing ?? {
		profile: { ...EMPTY_PROFILE },
		billing: { ...EMPTY_BILLING },
		updatedAt: ''
	};
}

/** Overwrite the profile section. Unknown fields are dropped. */
export function saveProfile(userId: number | string, patch: Partial<ProfileData>): ProfileData {
	const key = String(userId);
	const store = readStore();
	const existing = store.users[key] ?? {
		profile: { ...EMPTY_PROFILE },
		billing: { ...EMPTY_BILLING },
		updatedAt: ''
	};
	const next: ProfileData = {
		first_name:   typeof patch.first_name   === 'string' ? patch.first_name   : existing.profile.first_name,
		last_name:    typeof patch.last_name    === 'string' ? patch.last_name    : existing.profile.last_name,
		display_name: typeof patch.display_name === 'string' ? patch.display_name : existing.profile.display_name,
		email:        typeof patch.email        === 'string' ? patch.email        : existing.profile.email
	};
	store.users[key] = {
		...existing,
		profile: next,
		updatedAt: new Date().toISOString()
	};
	writeStore(store);
	return next;
}

/** Overwrite the billing section. Unknown fields are dropped. */
export function saveBilling(userId: number | string, patch: Partial<BillingData>): BillingData {
	const key = String(userId);
	const store = readStore();
	const existing = store.users[key] ?? {
		profile: { ...EMPTY_PROFILE },
		billing: { ...EMPTY_BILLING },
		updatedAt: ''
	};
	const next: BillingData = {
		first_name: typeof patch.first_name === 'string' ? patch.first_name : existing.billing.first_name,
		last_name:  typeof patch.last_name  === 'string' ? patch.last_name  : existing.billing.last_name,
		company:    typeof patch.company    === 'string' ? patch.company    : existing.billing.company,
		vat:        typeof patch.vat        === 'string' ? patch.vat        : existing.billing.vat,
		address:    typeof patch.address    === 'string' ? patch.address    : existing.billing.address,
		country:    typeof patch.country    === 'string' ? patch.country    : existing.billing.country,
		city:       typeof patch.city       === 'string' ? patch.city       : existing.billing.city,
		district:   typeof patch.district   === 'string' ? patch.district   : existing.billing.district,
		postal:     typeof patch.postal     === 'string' ? patch.postal     : existing.billing.postal,
		phone:      typeof patch.phone      === 'string' ? patch.phone      : existing.billing.phone,
		email:      typeof patch.email      === 'string' ? patch.email      : existing.billing.email
	};
	store.users[key] = {
		...existing,
		billing: next,
		updatedAt: new Date().toISOString()
	};
	writeStore(store);
	return next;
}
