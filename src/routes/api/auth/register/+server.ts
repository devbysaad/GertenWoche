import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import bcrypt from 'bcryptjs';
import { createUser } from '$lib/auth/users.js';
import { createSession } from '$lib/auth/session.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { username?: string; email?: string; password?: string };

	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { username, email, password } = body;

	// Validate inputs
	if (!username?.trim()) {
		throw error(400, 'Benutzername ist erforderlich');
	}
	if (!email || !EMAIL_REGEX.test(email)) {
		throw error(400, 'Gültige E-Mail-Adresse ist erforderlich');
	}
	if (!password || password.length < MIN_PASSWORD_LENGTH) {
		throw error(400, `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen haben`);
	}

	// Hash password with bcrypt (cost factor 12)
	const passwordHash = await bcrypt.hash(password, 12);

	let user;
	try {
		user = createUser({
			username: username.trim(),
			email: email.toLowerCase().trim(),
			passwordHash,
			tier: 'free'
		});
	} catch (err) {
		if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
			throw error(409, 'Diese E-Mail-Adresse ist bereits registriert');
		}
		if (err instanceof Error && err.message === 'USERNAME_EXISTS') {
			throw error(409, 'Dieser Benutzername ist bereits vergeben');
		}
		throw error(500, 'Registrierung fehlgeschlagen');
	}

	// Auto-login after registration
	await createSession(cookies, user.id, user.tier);

	return json(
		{
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				tier: user.tier,
				createdAt: new Date(user.createdAt)
			}
		},
		{ status: 201 }
	);
};
