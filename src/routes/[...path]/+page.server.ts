/**
 * Catch-all route handler for ALL article and category URLs.
 * Priority: article by path → article by slug → category archive → 404
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import {
	getArticleByPath,
	getArticleBySlug,
	getCategoryBySlug,
	getArticles,
	getRelatedArticles,
	getCategories
} from '$lib/api/index.js';

const PAGE_SIZE = 12;

export const load: PageServerLoad = async ({ params, url }) => {
	const path = (params.path ?? '').replace(/^\/|\/$/g, '');
	const segments = path.split('/').filter(Boolean);
	const slug = segments[segments.length - 1];

	const currentPage = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));

	// ── 1. Exact URL path match (article) ──────────────────────
	if (path) {
		const article = await getArticleByPath(path);
		if (article) {
			const [related, weitereArtikel] = await Promise.all([
				getRelatedArticles(
					article.subCategory?.slug ?? article.category.slug,
					article.slug,
					4
				),
				getArticles({ limit: 5, exclude: [article.slug] })
			]);
			return { type: 'article' as const, article, related, weitereArtikel };
		}
	}

	// ── 2. Slug-only match (article fallback) ───────────────────
	if (slug) {
		const article = await getArticleBySlug(slug);
		if (article) {
			const [related, weitereArtikel] = await Promise.all([
				getRelatedArticles(
					article.subCategory?.slug ?? article.category.slug,
					article.slug,
					4
				),
				getArticles({ limit: 5, exclude: [article.slug] })
			]);
			return { type: 'article' as const, article, related, weitereArtikel };
		}
	}

	// ── 3. Category archive ─────────────────────────────────────
	if (slug) {
		const category = await getCategoryBySlug(slug);
		if (category) {
			// Fetch ALL articles then paginate
			const allArticles = await getArticles({ category: slug, limit: 9999 });

			const totalArticles = allArticles.length;
			const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));
			const safePage = Math.min(currentPage, totalPages);
			const start = (safePage - 1) * PAGE_SIZE;
			const articles = allArticles.slice(start, start + PAGE_SIZE);

			const [weitereArtikel, subCategories, categories] = await Promise.all([
				getArticles({ limit: 5, exclude: allArticles.map((a) => a.slug) }),
				getCategories(slug),
				getCategories()
			]);

			return {
				type: 'category' as const,
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
		}
	}

	throw error(404, `Seite nicht gefunden: /${path}`);
};
