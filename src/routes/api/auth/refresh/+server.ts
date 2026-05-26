import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthError, publicUser, refreshWordPressToken } from '$lib/server/auth';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('wp_token');
	if (!token) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}

	try {
		const user = await refreshWordPressToken(token);

		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: SESSION_MAX_AGE,
			path: '/'
		});

		return json({ success: true, user: publicUser(user) });
	} catch (err) {
		// Refresh failure → drop the dead cookie so the next request restarts auth.
		cookies.delete('wp_token', { path: '/' });
		if (err instanceof AuthError) {
			return json({ error: err.message, kind: err.kind }, { status: err.status });
		}
		return json({ error: 'Sitzung konnte nicht aktualisiert werden.' }, { status: 500 });
	}
};
