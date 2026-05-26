import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { revokeWordPressToken } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('wp_token');

	// Clear the cookie first — that's what actually logs the user out.
	// Best-effort upstream revoke runs after, errors swallowed.
	cookies.delete('wp_token', { path: '/' });
	if (token) await revokeWordPressToken(token);

	return json({ success: true });
};
