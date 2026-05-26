import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthError, loginWithWordPress, publicUser } from '$lib/server/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { username?: string; password?: string };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Ungültiger Anfragetext.' }, { status: 400 });
	}

	const username = body.username?.trim();
	const password = body.password;

	if (!username || !password) {
		return json({ error: 'Benutzername und Passwort sind erforderlich.' }, { status: 400 });
	}

	try {
		const user = await loginWithWordPress(username, password);

		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: SESSION_MAX_AGE,
			path: '/'
		});

		return json({ success: true, user: publicUser(user) });
	} catch (err) {
		if (err instanceof AuthError) {
			return json({ error: err.message, code: err.upstreamCode, kind: err.kind }, { status: err.status });
		}
		return json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 500 });
	}
};
