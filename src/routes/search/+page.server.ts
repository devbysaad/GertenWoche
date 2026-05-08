import type { PageServerLoad } from './$types.js';
import { searchArticles } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const results = q ? await searchArticles(q, 24) : [];
	return { q, results };
};
