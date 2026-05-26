import type { RequestHandler } from './$types.js';
import { getCacheStats } from '$lib/api/cache.js';
import { dev } from '$app/environment';

export const GET: RequestHandler = async () => {
	// Only expose in development or when an admin token is provided
	if (!dev) {
		return new Response('Not Found', { status: 404 });
	}

	const stats = getCacheStats();

	return new Response(JSON.stringify(stats, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store'
		}
	});
};
