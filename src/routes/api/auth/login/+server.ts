import { json } from '@sveltejs/kit';
import { loginWithWordPress } from '$lib/server/auth';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let username: string;
	let password: string;

	try {
		const body = await request.json();
		username   = body.username;
		password   = body.password;
	} catch {
		return json({ error: 'Ungültiger Request-Body' }, { status: 400 });
	}

	if (!username || !password) {
		return json({ error: 'Benutzername und Passwort sind erforderlich' }, { status: 400 });
	}

	try {
		const user = await loginWithWordPress(username, password);

		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure:   !dev,
			sameSite: 'lax',
			maxAge:   60 * 60 * 24 * 7,
			path:     '/'
		});

		const { token, ...safeUser } = user;
		return json({ success: true, user: safeUser });

	} catch (err: any) {
		return json({ error: err.message || 'Ungültige Zugangsdaten' }, { status: 401 });
	}
};