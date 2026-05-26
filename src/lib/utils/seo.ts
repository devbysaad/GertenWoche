/**
 * SEO utility — builds consistent meta tag data for every page.
 * Import and use in +page.svelte <svelte:head> blocks.
 */

const SITE_NAME = 'Gartenwoche';
const SITE_URL  = 'https://gartenwoche.ch';
const DEFAULT_OG_IMAGE = `${SITE_URL}/Logo_Gartenwoche-1.png`;

/** Returns formatted title with site suffix */
export function formatTitle(pageTitle: string): string {
	if (pageTitle.includes(SITE_NAME)) return pageTitle;
	return `${pageTitle} | ${SITE_NAME}`;
}

/** Returns the canonical URL for a given path */
export function canonical(path: string): string {
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** JSON-LD: Organization schema */
export const organizationSchema = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: SITE_NAME,
	url: SITE_URL,
	logo: DEFAULT_OG_IMAGE,
	sameAs: []
};

/** JSON-LD: WebSite schema with sitelinks searchbox */
export const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: SITE_URL,
	potentialAction: {
		'@type': 'SearchAction',
		target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
		'query-input': 'required name=search_term_string'
	}
};

/** JSON-LD: Article schema */
export function articleSchema(opts: {
	title: string;
	description: string;
	url: string;
	image?: string;
	publishedAt: string;
	authorName: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: opts.title,
		description: opts.description,
		url: opts.url,
		image: opts.image ?? DEFAULT_OG_IMAGE,
		datePublished: opts.publishedAt,
		author: { '@type': 'Person', name: opts.authorName },
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE }
		}
	};
}

/** JSON-LD: BreadcrumbList schema */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: c.url
		}))
	};
}

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE };
