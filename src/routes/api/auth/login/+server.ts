// import { json } from '@sveltejs/kit';
// import { loginWithWordPress } from '$lib/server/auth';
// import type { RequestHandler } from './$types';

// export const POST: RequestHandler = async ({ request, cookies }) => {
// 	const { username, password } = await request.json();

// 	if (!username || !password) {
// 		return json({ error: 'Benutzername und Passwort sind erforderlich' }, { status: 400 });
// 	}

// 	try {
// 		const user = await loginWithWordPress(username, password);

// 		cookies.set('wp_token', user.token, {
// 			httpOnly: true,
// 			secure:   process.env.NODE_ENV === 'production',
// 			sameSite: 'lax',   // 'strict' breaks cookie on any external navigation
// 			maxAge:   60 * 60 * 24 * 7, // 7 days
// 			path:     '/'
// 		});

// 		const { token, ...safeUser } = user;
// 		return json({ success: true, user: safeUser });
// 	} catch (err: any) {
// 		return json({ error: err.message || 'Ungültige Zugangsdaten' }, { status: 401 });
// 	}
// };

import { json } from '@sveltejs/kit';
import { loginWithWordPress } from '$lib/server/auth';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	console.log('[LOGIN] POST /api/auth/login called');

	let username: string;
	let password: string;

	try {
		const body = await request.json();
		username   = body.username;
		password   = body.password;
		console.log('[LOGIN] Request body parsed, username:', username);
	} catch {
		console.error('[LOGIN] ❌ Failed to parse request body');
		return json({ error: 'Ungültiger Request-Body' }, { status: 400 });
	}

	if (!username || !password) {
		console.warn('[LOGIN] ❌ Missing username or password');
		return json({ error: 'Benutzername und Passwort sind erforderlich' }, { status: 400 });
	}

	try {
		console.log('[LOGIN] Calling loginWithWordPress for:', username);
		const user = await loginWithWordPress(username, password);

		// ✅ Use SvelteKit's `dev` flag instead of process.env.NODE_ENV
		console.log('[LOGIN] Setting wp_token cookie, dev mode:', dev);
		cookies.set('wp_token', user.token, {
			httpOnly: true,
			secure:   !dev,       // false on localhost, true in production
			sameSite: 'lax',
			maxAge:   60 * 60 * 24 * 7, // 7 days
			path:     '/'
		});
		console.log('[LOGIN] ✅ Cookie set successfully');

		const { token, ...safeUser } = user;
		console.log('[LOGIN] ✅ Login complete for:', safeUser.username, '| isPro:', safeUser.isPro);
		return json({ success: true, user: safeUser });

	} catch (err: any) {
		console.error('[LOGIN] ❌ Login failed for', username, '| reason:', err.message);
		return json({ error: err.message || 'Ungültige Zugangsdaten' }, { status: 401 });
	}
};