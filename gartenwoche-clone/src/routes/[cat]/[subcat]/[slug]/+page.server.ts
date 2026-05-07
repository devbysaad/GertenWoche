import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticleByPath, getRelatedArticles, getCategories } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const path = `${params.cat}/${params.subcat}/${params.slug}`;
	const [article, categories] = await Promise.all([
		getArticleByPath(path),
		getCategories()
	]);

	if (!article) throw error(404, `Artikel nicht gefunden (${path})`);

	const related = await getRelatedArticles(
		article.subCategory?.slug ?? article.category.slug,
		article.slug,
		4
	);

	return { article, related, categories };
};
