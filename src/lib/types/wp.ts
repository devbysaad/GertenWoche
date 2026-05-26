/**
 * Raw WordPress REST API types.
 *
 * These describe the shape of responses from WP_API_BASE (/wp-json/wp/v2/*)
 * BEFORE the transformer in `$lib/api/wordpress.ts` converts them into the
 * app-internal `Article` / `Category` / `Author` models.
 *
 * Use these when working directly with the WP REST API in new code (for
 * example: the HeadlessKey endpoints or future server routes that need the
 * untransformed payload). For day-to-day component work, prefer the
 * transformed models exported from `$lib/types`.
 */

export interface WPPost {
	id: number;
	slug: string;
	date: string;
	title: { rendered: string };
	excerpt: { rendered: string };
	content: { rendered: string };
	link: string;
	comment_count?: number;
	_embedded?: {
		'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
		author?: Array<{ name: string; avatar_urls?: Record<string, string> }>;
		'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
	};
}

export interface WPCategory {
	id: number;
	name: string;
	slug: string;
	count: number;
	parent: number;
}

export interface WPUser {
	id: number;
	name: string;
	first_name: string;
	last_name: string;
	email: string;
	avatar_urls?: Record<string, string>;
}

export interface WPEvent {
	id: number;
	title: { rendered: string };
	start_date: string;
	end_date: string;
	slug: string;
}

export interface AuthSession {
	userId: string;
	wpToken: string;
	username: string;
	email: string;
	name: string;
}
