import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { destroySession } from '$lib/auth/session.js';

export const POST: RequestHandler = async ({ cookies }) => {
	destroySession(cookies);
	return json({ success: true });
};
