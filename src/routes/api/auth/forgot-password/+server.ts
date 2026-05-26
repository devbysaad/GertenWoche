import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requestPasswordReset } from '$lib/server/auth';

/**
 * Trigger a password-reset email via HeadlessKey.
 *
 * Always returns 200 with a generic message — we deliberately don't tell
 * the caller whether the account exists, to prevent username/email enumeration.
 */
export const POST: RequestHandler = async ({ request }) => {
	let body: { email?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const email = body.email?.trim();
	if (!email) {
		return json({ error: 'E-Mail-Adresse ist erforderlich.' }, { status: 400 });
	}

	await requestPasswordReset(email);

	return json({
		success: true,
		message: 'Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen gesendet.'
	});
};
