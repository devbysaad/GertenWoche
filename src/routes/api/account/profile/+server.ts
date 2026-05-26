import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadUserData, saveProfile, type UserProfile } from '$lib/server/userStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS: Array<keyof UserProfile> = [
	'firstName',
	'lastName',
	'displayName',
	'email',
	'bio'
];

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	const record = loadUserData(locals.user.id);
	return json({ profile: record.profile, updatedAt: record.updatedAt });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Nicht angemeldet.' }, { status: 401 });

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const patch: UserProfile = {};
	const errors: Record<string, string> = {};

	for (const key of FIELDS) {
		// Accept both camelCase and snake_case from older callers.
		const raw =
			body[key] ??
			body[key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())];
		if (raw === undefined || raw === null) continue;
		if (typeof raw !== 'string') {
			errors[key] = 'Muss eine Zeichenkette sein.';
			continue;
		}
		const trimmed = raw.trim();
		if (key === 'email' && trimmed !== '' && !EMAIL_REGEX.test(trimmed)) {
			errors[key] = 'Ungültige E-Mail-Adresse.';
			continue;
		}
		if (key === 'firstName' || key === 'lastName') {
			if (trimmed.length > 60) {
				errors[key] = 'Maximal 60 Zeichen.';
				continue;
			}
		}
		if (key === 'displayName' && trimmed.length > 120) {
			errors[key] = 'Maximal 120 Zeichen.';
			continue;
		}
		if (key === 'bio' && trimmed.length > 1000) {
			errors[key] = 'Maximal 1000 Zeichen.';
			continue;
		}
		patch[key] = trimmed;
	}

	if (Object.keys(errors).length > 0) {
		return json({ error: 'Bitte überprüfen Sie die markierten Felder.', errors }, { status: 400 });
	}
	if (Object.keys(patch).length === 0) {
		return json({ error: 'Es wurden keine Änderungen übermittelt.' }, { status: 400 });
	}

	const record = saveProfile(locals.user.id, patch);
	return json({ success: true, profile: record.profile, updatedAt: record.updatedAt });
};
