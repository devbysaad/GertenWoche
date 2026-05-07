/**
 * Catch-all route handler for ALL article and category URLs.
 *
 * Priority order:
 * 1. Try to find an article by full URL path (e.g. "pflanzen/stauden/die-distel")
 * 2. Try to find an article by slug (last path segment, fallback for old URLs)
 * 3. Try to find a category by last segment → return category archive
 * 4. 404
 *
 * This handles:
 *   /gartenpraxis/[slug]
 *   /pflanzen/stauden/[slug]
 *   /aktuelles/schweiz/[slug]
 *   /gartenpraxis        (category archive)
 *   /pflanzen            (category archive)
 *   /allgemeines/[slug]  (edge category)
 *   etc.
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

export const load: PageServerLoad = async ({ params }) => {
	const path = (params.path ?? '').replace(/^\/|\/$/g, ''); // trim leading/trailing slashes
	const segments = path.split('/').filter(Boolean);
	const slug = segments[segments.length - 1]; // last segment is always the slug

	// ── 1. Try exact URL path match first (most accurate) ──
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

	// ── 2. Try slug-only match (handles short paths like /rasen/hirse-im-rasen) ──
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

	// ── 3. Try category archive (single segment like "gartenpraxis", or last segment of multi) ──
	if (slug) {
		const category = await getCategoryBySlug(slug);
		if (category) {
			const [articles, weitereArtikel, subCategories, categories] = await Promise.all([
				getArticles({ category: slug, limit: 24 }),
				getArticles({ limit: 5 }),
				getCategories(slug),
				getCategories()
			]);
			return {
				type: 'category' as const,
				category,
				articles,
				weitereArtikel,
				subCategories,
				categories
			};
		}
	}

	throw error(404, `Seite nicht gefunden: /${path}`);
};
