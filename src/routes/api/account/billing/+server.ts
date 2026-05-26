import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadUserData, saveBilling, type UserBilling } from '$lib/server/userStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9 ()\-./]{4,32}$/;

const FIELDS: Array<keyof UserBilling> = [
	'firstName',
	'lastName',
	'company',
	'vat',
	'address',
	'country',
	'city',
	'district',
	'postal',
	'phone',
	'email'
];

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	const record = loadUserData(locals.user.id);
	return json({ billing: record.billing, updatedAt: record.updatedAt });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Nicht angemeldet.' }, { status: 401 });

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const patch: UserBilling = {};
	const errors: Record<string, string> = {};

	for (const key of FIELDS) {
		const raw = body[key];
		if (raw === undefined || raw === null) continue;
		if (typeof raw !== 'string') {
			errors[key] = 'Muss eine Zeichenkette sein.';
			continue;
		}
		const trimmed = raw.trim();

		if (trimmed.length > 200) {
			errors[key] = 'Maximal 200 Zeichen.';
			continue;
		}
		if (key === 'email' && trimmed !== '' && !EMAIL_REGEX.test(trimmed)) {
			errors[key] = 'Ungültige E-Mail-Adresse.';
			continue;
		}
		if (key === 'phone' && trimmed !== '' && !PHONE_REGEX.test(trimmed)) {
			errors[key] = 'Ungültige Telefonnummer.';
			continue;
		}
		if (key === 'postal' && trimmed.length > 16) {
			errors[key] = 'Maximal 16 Zeichen.';
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

	const record = saveBilling(locals.user.id, patch);
	return json({ success: true, billing: record.billing, updatedAt: record.updatedAt });
};
