import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createUser, findByEmail } from '$lib/auth/users.js';
import { loginWithWordPress } from '$lib/server/auth.js';
import { dev } from '$app/environment';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { name?: string; username?: string; email?: string; password?: string };

	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const name = body.name?.trim() || body.username?.trim() || '';
	const { email, password } = body;

	if (!name) {
		throw error(400, 'Name ist erforderlich');
	}
	if (!email || !EMAIL_REGEX.test(email)) {
		throw error(400, 'Gültige E-Mail-Adresse ist erforderlich');
	}
	if (!password || password.length < MIN_PASSWORD_LENGTH) {
		throw error(400, `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen haben`);
	}

	if (await findByEmail(email)) {
		throw error(409, 'Diese E-Mail-Adresse ist bereits registriert');
	}

	let user;
	try {
		user = await createUser({
			email:    email.toLowerCase().trim(),
			username: name,
			name,
			password
		});
	} catch (err) {
		if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
			throw error(409, 'Diese E-Mail-Adresse ist bereits registriert');
		}
		throw error(500, 'Registrierung fehlgeschlagen');
	}

	// Auto-login using WordPress JWT — sets wp_token cookie
	try {
		const wpUser = await loginWithWordPress(user.username, password);

		cookies.set('wp_token', wpUser.token, {
			httpOnly: true,
			secure:   !dev,
			sameSite: 'lax',
			maxAge:   60 * 60 * 24 * 7,
			path:     '/'
		});

		return json(
			{
				user: {
					id:       wpUser.id,
					name:     wpUser.name,
					username: wpUser.username,
					email:    wpUser.email,
					isPro:    wpUser.isPro,
					roles:    wpUser.roles
				}
			},
			{ status: 201 }
		);
	} catch {
		// Registration succeeded but auto-login failed — user can login manually
		return json(
			{
				user: {
					id:    user.id,
					name:  user.name,
					email: user.email
				}
			},
			{ status: 201 }
		);
	}
};