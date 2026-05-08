import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
	const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /mein-konto
Disallow: /search

Sitemap: https://gartenwoche.ch/sitemap.xml`;

	return new Response(robots, {
		headers: { 'Content-Type': 'text/plain' }
	});
};
