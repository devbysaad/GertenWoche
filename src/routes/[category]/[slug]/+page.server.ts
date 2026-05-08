import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticleBySlug, getRelatedArticles, getCategoryBySlug } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const article = await getArticleBySlug(slug);
	if (!article) throw error(404, `Artikel "${slug}" nicht gefunden`);

	const [related, category] = await Promise.all([
		getRelatedArticles(article.category.slug, slug, 4),
		getCategoryBySlug(article.category.slug)
	]);

	return { article, related, category };
};
