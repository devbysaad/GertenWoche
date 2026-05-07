interface MetaResult {
	title: string;
	description: string;
	ogTitle: string;
	ogDescription: string;
	ogImage: string;
	canonical: string;
}

const DEFAULT_IMAGE = '/images/og-default.jpg';
const SITE_NAME = 'Gartenwoche';

export function generateMeta(
	title: string,
	description: string,
	image?: string,
	canonical?: string
): MetaResult {
	const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
	return {
		title: fullTitle,
		description: description.slice(0, 160),
		ogTitle: fullTitle,
		ogDescription: description.slice(0, 200),
		ogImage: image ?? DEFAULT_IMAGE,
		canonical: canonical ?? ''
	};
}
