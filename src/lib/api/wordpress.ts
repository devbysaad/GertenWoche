/**
 * WordPress REST API client.
 * Fetches live data from gartenwoche.ch and transforms it into typed models.
 * Falls back to static data if the API is unreachable.
 *
 * Key fixes vs. v1:
 *  - Full pagination: fetches ALL posts across multiple pages
 *  - Proper image extraction: uses _embedded['wp:featuredmedia'][0].source_url
 *  - URL path extraction: stores article.path from post.link for correct routing
 */

import { env } from '$env/dynamic/private';
import { getCached, setCached, TTL } from './cache.js';
import {
	FALLBACK_ARTICLES,
	FALLBACK_AUTHORS,
	FALLBACK_CATEGORIES,
	FALLBACK_EVENTS,
	FALLBACK_DIRECTORY
} from './fallback.js';
import type { Article, ArticlePreview, Author, Category, DirectoryEntry, GartenEvent } from '$lib/types/index.js';

function getBaseUrl() {
	return env.WP_API_BASE ?? 'https://gartenwoche.ch/wp-json/wp/v2';
}
const FETCH_TIMEOUT = 30000; // 30 seconds — WP API is slow

// ============================================================
// RAW WP TYPES
// ============================================================

interface WpPost {
	id: number;
	slug: string;
	link: string;         // Full canonical URL — use for routing
	date: string;
	modified: string;
	title: { rendered: string };
	excerpt: { rendered: string };
	content: { rendered: string };
	categories: number[];
	tags: number[];
	comment_count: number;
	meta?: Record<string, unknown>;  // arbitrary post meta
	acf?: Record<string, unknown>;   // ACF fields
	_embedded?: {
		'wp:featuredmedia'?: Array<{
			source_url: string;
			alt_text?: string;
			media_details?: {
				sizes?: {
					full?: { source_url: string };
					large?: { source_url: string };
					medium_large?: { source_url: string };
					medium?: { source_url: string };
				};
			};
		}>;
		author?: Array<{ id: number; name: string; slug: string; avatar_urls?: Record<string, string>; description?: string }>;
		'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>;
	};
}

interface WpCategory {
	id: number;
	name: string;
	slug: string;
	parent: number;
	count: number;
}

interface WpUser {
	id: number;
	name: string;
	slug: string;
	avatar_urls?: Record<string, string>;
	description?: string;
}

interface WpTribeEvent {
	id: number;
	slug: string;
	link: string;
	title: { rendered: string };
	content: { rendered: string };
	meta?: {
		_EventStartDate?: string;
		_EventEndDate?: string;
		_EventVenueID?: string;
		_EventOrganizerID?: string;
	};
	_embedded?: {
		'wp:featuredmedia'?: Array<{ source_url: string }>;
	};
}

// ============================================================
// HTTP HELPERS
// ============================================================

/** Low-level fetch with timeout — returns Response so callers can read headers */
async function wpRawFetch(endpoint: string): Promise<Response | null> {
	const url = `${getBaseUrl()}${endpoint}`;
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
		const res = await fetch(url, {
			signal: controller.signal,
			headers: { 'Accept': 'application/json' }
		});
		clearTimeout(timer);
		if (!res.ok) {
			if (res.status === 404) return null;
			throw new Error(`HTTP ${res.status}`);
		}
		return res;
	} catch (err) {
		console.warn(`[WP API] Failed to fetch ${url}:`, err);
		return null;
	}
}

/** Fetch a single endpoint with TTL caching */
async function wpFetch<T>(endpoint: string, ttl = TTL.DEFAULT): Promise<T | null> {
	const cacheKey = `${getBaseUrl()}${endpoint}`;
	const cached = getCached<T>(cacheKey);
	if (cached) return cached;

	const res = await wpRawFetch(endpoint);
	if (!res) return null;

	const data: T = await res.json();
	setCached(cacheKey, data, ttl);
	return data;
}

/**
 * Fetch ALL pages of a paginated WP REST endpoint.
 * Uses X-WP-TotalPages header to know how many pages to fetch.
 */
async function wpFetchAll<T>(endpoint: string, ttl = TTL.ARTICLES): Promise<T[]> {
	const cacheKey = `ALL:${getBaseUrl()}${endpoint}`;
	const cached = getCached<T[]>(cacheKey);
	if (cached) return cached;

	// Fetch first page and read total pages from headers
	const sep = endpoint.includes('?') ? '&' : '?';
	const firstRes = await wpRawFetch(`${endpoint}${sep}per_page=100&page=1`);
	if (!firstRes) return [];

	const totalPages = parseInt(firstRes.headers.get('X-WP-TotalPages') ?? '1', 10);
	const firstPage: T[] = await firstRes.json();

	if (totalPages <= 1) {
		setCached(cacheKey, firstPage, ttl);
		return firstPage;
	}

	// Fetch remaining pages concurrently
	const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) =>
		wpFetch<T[]>(`${endpoint}${sep}per_page=100&page=${i + 2}`, ttl)
	);
	const remainingPages = await Promise.all(pagePromises);

	const all = [
		...firstPage,
		...remainingPages.flatMap((p) => p ?? [])
	];

	setCached(cacheKey, all, ttl);
	return all;
}

// ============================================================
// SINGLETON DATA STORE (loaded once per server lifecycle)
// ============================================================

let _categories: Category[] | null = null;
let _authors: Author[] | null = null;
let _articles: Article[] | null = null;
let _events: GartenEvent[] | null = null;
let _directory: DirectoryEntry[] | null = null;

// Promise deduplication — prevents concurrent callers from each firing their own fetch
let _categoriesPromise: Promise<Category[]> | null = null;
let _authorsPromise: Promise<Author[]> | null = null;
let _articlesPromise: Promise<Article[]> | null = null;

// ============================================================
// TRANSFORM FUNCTIONS
// ============================================================

function transformCategory(wpCat: WpCategory, allCats: WpCategory[]): Category {
	const parent = wpCat.parent ? allCats.find((c) => c.id === wpCat.parent) : undefined;
	return {
		id: String(wpCat.id),
		name: wpCat.name,
		slug: wpCat.slug,
		parent: parent?.slug,
		count: wpCat.count
	};
}

function transformAuthor(wpUser: WpUser): Author {
	const avatarUrl = wpUser.avatar_urls
		? (wpUser.avatar_urls['96'] ?? wpUser.avatar_urls['48'] ?? '')
		: '';
	return {
		id: String(wpUser.id),
		name: wpUser.name,
		slug: wpUser.slug,
		avatar: avatarUrl || undefined,
		bio: wpUser.description || undefined
	};
}

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

/**
 * Extract URL path segments from post.link for correct routing.
 * e.g. "https://gartenwoche.ch/pflanzen/stauden/die-distel/" → ["pflanzen","stauden","die-distel"]
 */
function extractPathFromLink(link: string): string[] {
	try {
		const url = new URL(link);
		return url.pathname
			.split('/')
			.filter(Boolean)
			.filter((s) => s !== 'category');
	} catch {
		return [];
	}
}

function transformPost(
	wpPost: WpPost,
	categories: Category[],
	authors: Author[]
): Article | null {
	const embedded = wpPost._embedded;
	const embeddedTerms = embedded?.['wp:term'] ?? [];
	const catTerms = embeddedTerms[0] ?? [];
	const tagTerms = embeddedTerms[1] ?? [];

	let category: Category | undefined;
	let subCategory: Category | undefined;

	// Use embedded terms (most accurate)
	for (const term of catTerms) {
		const cat = categories.find((c) => c.slug === term.slug);
		if (cat && !category) {
			if (cat.parent) {
				subCategory = cat;
				category = categories.find((c) => c.slug === cat.parent);
			} else {
				category = cat;
			}
		}
	}

	// Fallback to category IDs
	if (!category && wpPost.categories.length > 0) {
		category = categories.find((c) => c.id === String(wpPost.categories[0]));
	}
	if (!category) {
		category = categories[0] ?? FALLBACK_CATEGORIES[0];
	}

	// Author from embedded data
	const embeddedAuthor = embedded?.author?.[0];
	let author: Author | undefined;
	if (embeddedAuthor) {
		author = authors.find((a) => a.slug === embeddedAuthor.slug) ?? transformAuthor(embeddedAuthor);
	}
	if (!author) author = authors[0] ?? FALLBACK_AUTHORS[0];

	// --- Critical fix: use _embedded featured media with fallback chain ---
	const featuredMedia = embedded?.['wp:featuredmedia']?.[0];
	const thumbnail =
		featuredMedia?.source_url
		?? featuredMedia?.media_details?.sizes?.full?.source_url
		?? featuredMedia?.media_details?.sizes?.large?.source_url
		?? featuredMedia?.media_details?.sizes?.medium_large?.source_url
		?? featuredMedia?.media_details?.sizes?.medium?.source_url
		?? '';

	const tags = tagTerms.map((t) => t.slug);
	const rawExcerpt =
		stripHtml(wpPost.excerpt.rendered).trim() ||
		stripHtml(wpPost.content.rendered).trim().slice(0, 1500);

	// --- Critical fix: extract URL path from post.link ---
	const linkSegments = extractPathFromLink(wpPost.link);
	// linkSegments: ["pflanzen", "stauden", "die-distel"] or ["gartenpraxis", "slug"]
	// The last segment is the slug, everything before is the category path
	const urlPath = linkSegments.join('/'); // "pflanzen/stauden/die-distel"

	return {
		id: String(wpPost.id),
		slug: wpPost.slug,
		urlPath,                        // Full routable path
		title: stripHtml(wpPost.title.rendered),
		excerpt: rawExcerpt,
		content: wpPost.content.rendered,
		category,
		subCategory,
		author,
		publishedAt: new Date(wpPost.date),
		updatedAt: new Date(wpPost.modified),
		thumbnail,
		isPro: !!(
			wpPost.meta?.is_premium ||
			wpPost.meta?.['_is_pro'] ||
			wpPost.acf?.premium_content ||
			wpPost.acf?.is_pro
		),
		tags,
		commentCount: wpPost.comment_count ?? 0
	};
}

// ============================================================
// LOADERS
// ============================================================

async function loadCategories(): Promise<Category[]> {
	if (_categories) return _categories;
	if (_categoriesPromise) return _categoriesPromise;
	_categoriesPromise = (async () => {
		const wpCats = await wpFetchAll<WpCategory>('/categories', TTL.CATEGORIES);
		_categories = wpCats.length ? wpCats.map((c) => transformCategory(c, wpCats)) : [];
		return _categories;
	})();
	return _categoriesPromise;
}

async function loadAuthors(): Promise<Author[]> {
	if (_authors) return _authors;
	if (_authorsPromise) return _authorsPromise;
	_authorsPromise = (async () => {
		const wpUsers = await wpFetchAll<WpUser>('/users', TTL.CATEGORIES);
		_authors = wpUsers.length ? wpUsers.map(transformAuthor) : [];
		return _authors;
	})();
	return _authorsPromise;
}

async function loadArticles(): Promise<Article[]> {
	if (_articles) return _articles;
	if (_articlesPromise) return _articlesPromise; // deduplicate concurrent calls
	_articlesPromise = (async () => {
		const [categories, authors] = await Promise.all([loadCategories(), loadAuthors()]);
		const wpPosts = await wpFetchAll<WpPost>('/posts?_embed', TTL.ARTICLES);
		if (!wpPosts.length) {
			console.warn('[WP API] No posts fetched from live API, returning empty list (no mock fallback).');
			_articles = [];
			return _articles;
		}
		const articles = wpPosts
			.map((p) => transformPost(p, categories, authors))
			.filter((a): a is Article => a !== null);

		const japankaeferSlug = 'kampagne-japankaefer-stoppen-lanciert';
		const voyagerSlug = 'kress-voyager-hohe-maehleistung-fuer-profis';

		const hasJapankaefer = articles.some((a) => a.slug === japankaeferSlug || a.slug === 'kampagne-stopp-japankaefer-lanciert');
		const hasVoyager = articles.some((a) => a.slug === voyagerSlug);

		if (!hasJapankaefer) {
			const fbHero = FALLBACK_ARTICLES.find((a) => a.slug === japankaeferSlug);
			if (fbHero) {
				const clonedHero = JSON.parse(JSON.stringify(fbHero)) as Article;
				clonedHero.publishedAt = new Date(fbHero.publishedAt);
				clonedHero.updatedAt = new Date(fbHero.updatedAt);
				articles.push(clonedHero);
			}
		}

		if (!hasVoyager) {
			const fbVoyager = FALLBACK_ARTICLES.find((a) => a.slug === voyagerSlug);
			if (fbVoyager) {
				const clonedVoyager = JSON.parse(JSON.stringify(fbVoyager)) as Article;
				clonedVoyager.publishedAt = new Date(fbVoyager.publishedAt);
				clonedVoyager.updatedAt = new Date(fbVoyager.updatedAt);
				articles.push(clonedVoyager);
			}
		}

		_articles = articles;
		return _articles;
	})();
	return _articlesPromise;
}


async function loadEvents(): Promise<GartenEvent[]> {
	if (_events) return _events;

	const wpEvents = await wpFetchAll<WpTribeEvent>('/tribe_events?_embed', TTL.EVENTS);
	if (!wpEvents.length) {
		console.warn('[WP API] No events fetched from live API, returning empty list (no mock fallback).');
		_events = [];
		return _events;
	}

	_events = wpEvents.map((e) => ({
		id: String(e.id),
		slug: e.slug,
		title: stripHtml(e.title.rendered),
		description: e.content.rendered,
		startDate: new Date(e.meta?._EventStartDate ?? Date.now()),
		endDate: new Date(e.meta?._EventEndDate ?? Date.now()),
		location: '',
		city: '',
		country: 'Schweiz',
		thumbnail: e._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''
	}));

	return _events;
}

async function loadDirectory(): Promise<DirectoryEntry[]> {
	if (_directory) return _directory;
	_directory = FALLBACK_DIRECTORY;
	return _directory;
}

// ============================================================
// PUBLIC API HELPERS
// ============================================================

export interface ArticleFilter {
	category?: string;
	limit?: number;
	page?: number;
	exclude?: string[];
}

export async function getArticles(filter?: ArticleFilter): Promise<ArticlePreview[]> {
	const all = await loadArticles();
	let result = [...all] as ArticlePreview[];

	if (filter?.category) {
		result = result.filter(
			(a) => a.category.slug === filter.category || a.subCategory?.slug === filter.category
		);
	}

	if (filter?.exclude?.length) {
		result = result.filter((a) => !filter.exclude!.includes(a.slug));
	}

	result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const page = filter?.page ?? 1;
	const limit = filter?.limit ?? 100;
	const start = (page - 1) * limit;
	return result.slice(start, start + limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
	if (_articles) {
		const found = _articles.find((a) => a.slug === slug);
		if (found) return found;
	}

	const endpoint = `/posts?slug=${slug}&_embed`;
	const posts = await wpFetch<WpPost[]>(endpoint, TTL.ARTICLES);
	if (!posts || posts.length === 0) return null;

	const [categories, authors] = await Promise.all([loadCategories(), loadAuthors()]);
	return transformPost(posts[0], categories, authors);
}

/** Find article by its full URL path (e.g. "pflanzen/stauden/die-distel") */
export async function getArticleByPath(path: string): Promise<Article | null> {
	const all = await loadArticles();
	const normalised = path.replace(/^\/|\/$/g, '');
	return all.find((a) => a.urlPath === normalised) ?? null;
}

export async function getArticlesByCategory(
	categorySlug: string,
	limit = 10,
	exclude?: string[]
): Promise<ArticlePreview[]> {
	return getArticles({ category: categorySlug, limit, exclude });
}

export async function getCategories(parentSlug?: string): Promise<Category[]> {
	const cats = await loadCategories();
	if (parentSlug) {
		return cats.filter((c) => c.parent === parentSlug);
	}
	return cats;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
	const cats = await loadCategories();
	return cats.find((c) => c.slug === slug) ?? null;
}

export async function getEvents(filter?: { past?: boolean }): Promise<GartenEvent[]> {
	const all = await loadEvents();
	const now = new Date();
	if (filter?.past) {
		return all.filter((e) => e.endDate < now).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
	}
	return all.filter((e) => e.endDate >= now).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export async function getEventBySlug(slug: string): Promise<GartenEvent | null> {
	const all = await loadEvents();
	return all.find((e) => e.slug === slug) ?? null;
}

export async function getDirectoryEntries(): Promise<DirectoryEntry[]> {
	return loadDirectory();
}

export async function getDirectoryEntryBySlug(slug: string): Promise<DirectoryEntry | null> {
	const all = await loadDirectory();
	return all.find((e) => e.slug === slug) ?? null;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
	const all = await loadAuthors();
	return all.find((a) => a.slug === slug) ?? null;
}

export async function getArticlesByAuthor(authorSlug: string, limit = 24): Promise<ArticlePreview[]> {
	const all = await loadArticles();
	return all
		.filter((a) => a.author.slug === authorSlug)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
		.slice(0, limit);
}

export async function searchArticles(query: string, limit = 24): Promise<ArticlePreview[]> {
	if (!query.trim()) return [];
	const q = query.toLowerCase();
	const all = await loadArticles();
	return all
		.filter(
			(a) =>
				a.title.toLowerCase().includes(q) ||
				a.excerpt.toLowerCase().includes(q) ||
				a.category.name.toLowerCase().includes(q)
		)
		.slice(0, limit);
}

export async function getRelatedArticles(
	categorySlug: string,
	excludeSlug: string,
	limit = 4
): Promise<ArticlePreview[]> {
	return getArticles({ category: categorySlug, limit, exclude: [excludeSlug] });
}

export async function getArticleCount(categorySlug?: string): Promise<number> {
	const articles = await getArticles(categorySlug ? { category: categorySlug } : undefined);
	return articles.length;
}
