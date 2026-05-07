import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticlesByCategory, getCategoryBySlug, getCategories, getArticles } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params }) => {
	// params.slug is an array joined by '/' due to catch-all
	const slugParts = params.slug.split('/').filter(Boolean);
	// Last segment is the category/subcategory slug to look up
	const categorySlug = slugParts[slugParts.length - 1];

	const [category, categories] = await Promise.all([
		getCategoryBySlug(categorySlug),
		getCategories()
	]);

	if (!category) throw error(404, `Kategorie nicht gefunden: ${categorySlug}`);

	// Fetch articles for this category (main grid)
	const articles = await getArticlesByCategory(categorySlug, 20);

	// Subcategories of this category
	const subCategories = categories.filter((c) => c.parent === categorySlug);

	// "Weitere Artikel" sidebar — recent articles from other categories
	const weitereArtikel = await getArticles({ limit: 6, exclude: articles.map((a) => a.slug) });

	return {
		category,
		articles,
		weitereArtikel,
		subCategories,
		categories
	};
};
