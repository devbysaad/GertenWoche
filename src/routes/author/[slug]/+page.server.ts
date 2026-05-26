import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getAuthorBySlug, getArticlesByAuthor } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const [author, articles] = await Promise.all([
		getAuthorBySlug(params.slug),
		getArticlesByAuthor(params.slug)
	]);
	if (!author) throw error(404, `Autor "${params.slug}" nicht gefunden`);
	return { author, articles };
};
