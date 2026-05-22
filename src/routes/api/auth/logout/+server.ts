import { json } from '@sveltejs/kit';
import { clearUserCache } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('wp_token');

	// Remove from server-side cache so next user gets fresh data
	if (token) {
		clearUserCache(token);
	}

	cookies.delete('wp_token', { path: '/' });

	return json({ success: true });
};