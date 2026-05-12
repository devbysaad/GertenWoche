import { json } from '@sveltejs/kit';
import { loginWithWordPress } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	if (!username || !password) {
		return json({ error: 'Benutzername und Passwort sind erforderlich' }, { status: 400 });
	}

	try {
		const user = await loginWithWordPress(username, password);

		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7,
			path: '/'
		});

		const { token, ...safeUser } = user;
		return json({ success: true, user: safeUser });
	} catch (err: any) {
		return json({ error: err.message || 'Ungültige Zugangsdaten' }, { status: 401 });
	}
};
