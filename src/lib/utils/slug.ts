/**
 * Generate a URL-safe slug from a string.
 */
export function toSlug(str: string): string {
	return str
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

/**
 * Build the canonical article URL from category slug and article slug.
 * Handles both 2-level (/cat/slug) and 3-level (/cat/subcat/slug) routing.
 */
export function buildArticleUrl(categorySlug: string, articleSlug: string, parentSlug?: string): string {
	if (parentSlug) {
		return `/${parentSlug}/${categorySlug}/${articleSlug}`;
	}
	return `/${categorySlug}/${articleSlug}`;
}
