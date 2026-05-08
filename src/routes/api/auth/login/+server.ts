import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import bcrypt from 'bcryptjs';
import { findByEmail } from '$lib/auth/users.js';
import { createSession } from '$lib/auth/session.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	let body: { email?: string; password?: string };

	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { email, password } = body;

	if (!email || !password) {
		throw error(400, 'E-Mail und Passwort sind erforderlich');
	}

	// Look up user
	const user = findByEmail(email);
	if (!user) {
		// Constant-time: still hash to prevent timing attacks
		await bcrypt.compare(password, '$2b$12$invalidhashtopreventtiming00000');
		throw error(401, 'Ungültige E-Mail oder Passwort');
	}

	// Verify password
	const valid = await bcrypt.compare(password, user.passwordHash);
	if (!valid) {
		throw error(401, 'Ungültige E-Mail oder Passwort');
	}

	// Set session cookie
	await createSession(cookies, user.id, user.tier);

	return json({
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
			tier: user.tier,
			createdAt: new Date(user.createdAt)
		}
	});
};
