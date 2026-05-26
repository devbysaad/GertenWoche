import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthError, publicUser, registerWithWordPress } from '$lib/server/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,60}$/;
const MIN_PASSWORD_LENGTH = 8;

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: {
		username?: string;
		email?: string;
		password?: string;
		name?: string;        // legacy alias for displayName
		firstName?: string;
		lastName?: string;
		displayName?: string;
	};

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const email       = body.email?.trim().toLowerCase();
	const password    = body.password ?? '';
	const firstName   = body.firstName?.trim() ?? '';
	const lastName    = body.lastName?.trim()  ?? '';
	const displayName = (body.displayName ?? body.name)?.trim() ?? '';

	// Username can be supplied explicitly, or derived from email-local-part
	// (matches the way the LoginModal collects it implicitly).
	let username = body.username?.trim() ?? '';
	if (!username && email) {
		username = email
			.split('@')[0]
			.replace(/[^a-zA-Z0-9_.-]/g, '')
			.slice(0, 60);
	}

	// ── Local validation (don't burn a WP round-trip for obvious failures) ──
	if (!email || !EMAIL_REGEX.test(email)) {
		return json({ error: 'Gültige E-Mail-Adresse ist erforderlich.' }, { status: 400 });
	}
	if (!username || !USERNAME_REGEX.test(username)) {
		return json(
			{ error: 'Benutzername muss 3–60 Zeichen lang sein und darf nur Buchstaben, Zahlen, Punkt, Bindestrich und Unterstrich enthalten.' },
			{ status: 400 }
		);
	}
	if (password.length < MIN_PASSWORD_LENGTH) {
		return json(
			{ error: `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.` },
			{ status: 400 }
		);
	}

	try {
		const user = await registerWithWordPress({
			username,
			email,
			password,
			firstName: firstName || undefined,
			lastName: lastName || undefined,
			displayName: displayName || undefined
		});

		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: SESSION_MAX_AGE,
			path: '/'
		});

		return json({ success: true, user: publicUser(user) }, { status: 201 });
	} catch (err) {
		if (err instanceof AuthError) {
			return json({ error: err.message, code: err.upstreamCode, kind: err.kind }, { status: err.status });
		}
		return json({ error: 'Registrierung fehlgeschlagen.' }, { status: 500 });
	}
};
