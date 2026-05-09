import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticlesByCategory, getCategoryBySlug, getCategories, getArticles } from '$lib/api/index.js';

// First 5 go to magazine grid, then 12 per page in the remaining 2-col grid
const MAG_COUNT = 5;
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

	// Paginate server-side: always include first 5 for mag grid + 12 per page remaining
	const totalArticles = allArticles.length;
	const remainingTotal = Math.max(0, totalArticles - MAG_COUNT);
	const totalPages = Math.max(1, Math.ceil(remainingTotal / PAGE_SIZE));
	const safePage = Math.min(currentPage, totalPages);
	const remStart = (safePage - 1) * PAGE_SIZE + MAG_COUNT;
	const articles = [
		...allArticles.slice(0, MAG_COUNT),
		...allArticles.slice(remStart, remStart + PAGE_SIZE)
	];

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
