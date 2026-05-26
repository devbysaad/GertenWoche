import type { RequestHandler } from './$types.js';
import { getArticles, getCategories } from '$lib/api/index.js';

export const GET: RequestHandler = async () => {
	const [articles, categories] = await Promise.all([
		getArticles({ limit: 1000 }),
		getCategories()
	]);

	const base = 'https://gartenwoche.ch';
	const now = new Date().toISOString().split('T')[0];

	const staticUrls = [
		{ loc: base, priority: '1.0', changefreq: 'daily' },
		{ loc: `${base}/veranstaltungen`, priority: '0.8', changefreq: 'weekly' },
		{ loc: `${base}/branchenverzeichnis`, priority: '0.8', changefreq: 'weekly' },
		{ loc: `${base}/abonnement`, priority: '0.7', changefreq: 'monthly' },
		{ loc: `${base}/impressum`, priority: '0.3', changefreq: 'yearly' },
		{ loc: `${base}/datenschutzerklaerung`, priority: '0.3', changefreq: 'yearly' },
		{ loc: `${base}/allgemeine-geschaeftsbedingungen`, priority: '0.3', changefreq: 'yearly' },
		{ loc: `${base}/schreiben-sie-uns`, priority: '0.4', changefreq: 'yearly' },
		{ loc: `${base}/stellenangebote-fuer-die-gruene-branche`, priority: '0.5', changefreq: 'weekly' },
		{ loc: `${base}/podcast-garten`, priority: '0.6', changefreq: 'weekly' }
	];

	const categoryUrls = categories.map((c) => ({
		loc: c.parent ? `${base}/category/${c.parent}/${c.slug}` : `${base}/category/${c.slug}`,
		priority: '0.7',
		changefreq: 'daily'
	}));

	const articleUrls = articles.map((a) => ({
		loc: a.subCategory
			? `${base}/${a.category.slug}/${a.subCategory.slug}/${a.slug}`
			: `${base}/${a.category.slug}/${a.slug}`,
		lastmod: a.publishedAt.toISOString().split('T')[0],
		priority: '0.8',
		changefreq: 'monthly'
	}));


	const allUrls = [...staticUrls, ...categoryUrls, ...articleUrls];

	interface SitemapUrl {
		loc: string;
		lastmod?: string;
		priority: string;
		changefreq: string;
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(allUrls as SitemapUrl[])
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod ?? now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;


	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
