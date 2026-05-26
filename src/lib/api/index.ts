/**
 * Public barrel export for the API layer.
 * All page server files should import from $api/index.js
 */

export {
	getArticles,
	getArticleBySlug,
	getArticleByPath,
	getArticlesByCategory,
	getArticlesByAuthor,
	getCategories,
	getCategoryBySlug,
	getEvents,
	getEventBySlug,
	getDirectoryEntries,
	getDirectoryEntryBySlug,
	getAuthorBySlug,
	searchArticles,
	getRelatedArticles,
	getArticleCount
} from './wordpress.js';

export type { ArticleFilter } from './wordpress.js';
