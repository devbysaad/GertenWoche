/**
 * @file article.ts
 * TypeScript interfaces for article data.
 * ArticlePreview is used in list/grid components (no HTML body).
 * Article is used on the full article detail page (includes rendered HTML content).
 */
import type { Category } from './category.js';
import type { Author } from './author.js';

/**
 * Lightweight article type — used in cards, grids, and lists.
 * Does NOT include the full article body (content), to keep payloads small.
 */
export interface ArticlePreview {
	id: string;
	slug: string;
	/** Full routable path extracted from post.link. e.g. "pflanzen/stauden/die-distel" */
	urlPath: string;
	title: string;
	excerpt: string;
	category: Category;
	subCategory?: Category;
	author: Author;
	publishedAt: Date;
	thumbnail: string;
	/** Whether the article is behind the premium paywall */
	isPro: boolean;
	tags?: string[];
}

/**
 * Full article type — extends ArticlePreview with the rendered HTML body.
 * Used only on the single article detail page (/[...path]/+page.svelte).
 */
export interface Article extends ArticlePreview {
	/** Rendered HTML from WordPress — displayed in .prose container */
	content: string;
	updatedAt: Date;
	commentCount: number;
}

