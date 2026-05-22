import { json } from '@sveltejs/kit';
import { clearUserCache } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('wp_token');

	// Remove from server-side cache so next user gets fresh data
	if (token) {
		console.log('[LOGOUT] Clearing token from server cache...');
		clearUserCache(token);
	}

	cookies.delete('wp_token', { path: '/' });
	console.log('[LOGOUT] ✅ Cookie deleted, user logged out');

	return json({ success: true });
};