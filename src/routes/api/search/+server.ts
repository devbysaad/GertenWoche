import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { searchArticles } from '$lib/api/index.js';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	if (!q.trim()) return json([]);
	const results = await searchArticles(q, 6);
	return json(results);
};
