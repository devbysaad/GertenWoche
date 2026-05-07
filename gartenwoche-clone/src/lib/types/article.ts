import type { Category } from './category.js';
import type { Author } from './author.js';

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
	isPro: boolean;
	tags?: string[];
}

export interface Article extends ArticlePreview {
	content: string; // rendered HTML
	updatedAt: Date;
	commentCount: number;
}
