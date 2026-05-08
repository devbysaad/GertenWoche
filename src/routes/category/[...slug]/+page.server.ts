import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticlesByCategory, getCategoryBySlug, getCategories, getArticles } from '$lib/api/index.js';

const PAGE_SIZE = 12;

export const load: PageServerLoad = async ({ params, url }) => {
	const slugParts = params.slug.split('/').filter(Boolean);
	const categorySlug = slugParts[slugParts.length - 1];

	const currentPage = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));

	const [category, categories] = await Promise.all([
		getCategoryBySlug(categorySlug),
		getCategories()
	]);

	if (!category) throw error(404, `Kategorie nicht gefunden: ${categorySlug}`);

	// Fetch ALL articles for this category (no limit — full pagination)
	const allArticles = await getArticlesByCategory(categorySlug, 9999);

	// Paginate server-side
	const totalArticles = allArticles.length;
	const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));
	const safePage = Math.min(currentPage, totalPages);
	const start = (safePage - 1) * PAGE_SIZE;
	const articles = allArticles.slice(start, start + PAGE_SIZE);

	// Subcategories
	const subCategories = categories.filter((c) => c.parent === categorySlug);

	// "Weitere Artikel" sidebar — 5 most recent from OTHER categories
	const weitereArtikel = await getArticles({
		limit: 5,
		exclude: allArticles.map((a) => a.slug)
	});

	return {
		category,
		articles,
		weitereArtikel,
		subCategories,
		categories,
		pagination: {
			currentPage: safePage,
			totalPages,
			totalArticles
		}
	};
};
