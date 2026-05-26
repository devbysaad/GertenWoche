import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthError, changeWordPressPassword, publicUser } from '$lib/server/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const MIN_PASSWORD_LENGTH = 8;

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}

	let body: { currentPassword?: string; newPassword?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const currentPassword = body.currentPassword ?? '';
	const newPassword     = body.newPassword     ?? '';

	if (!currentPassword || !newPassword) {
		return json({ error: 'Aktuelles und neues Passwort sind erforderlich.' }, { status: 400 });
	}
	if (newPassword.length < MIN_PASSWORD_LENGTH) {
		return json(
			{ error: `Neues Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.` },
			{ status: 400 }
		);
	}
	if (newPassword === currentPassword) {
		return json({ error: 'Neues Passwort darf nicht dem aktuellen entsprechen.' }, { status: 400 });
	}

	const token = cookies.get('wp_token');
	if (!token) {
		return json({ error: 'Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.' }, { status: 401 });
	}

	try {
		const user = await changeWordPressPassword(token, currentPassword, newPassword);

		// HeadlessKey may rotate the token on password change. If so, refresh the cookie.
		if (user.token && user.token !== token) {
			cookies.set('wp_token', user.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: SESSION_MAX_AGE,
				path: '/'
			});
		}

		return json({ success: true, user: publicUser(user) });
	} catch (err) {
		if (err instanceof AuthError) {
			return json({ error: err.message, kind: err.kind }, { status: err.status });
		}
		return json({ error: 'Passwort konnte nicht geändert werden.' }, { status: 500 });
	}
};
