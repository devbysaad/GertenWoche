/**
 * @file +page.server.ts — Homepage Data Loader
 * ─────────────────────────────────────────────────────────
 * Fetches ALL homepage data in parallel via Promise.all() for performance.
 * The returned object is available in +page.svelte as `let { data } = $props()`.
 *
 * Data slots:
 *  hero            → Main large hero image article (left side)
 *  heroSide        → 2 articles stacked on the right of the hero
 *  gridArticles    → 3 articles for the 3-column article grid
 *  rasenMain       → Large left article in the Rasen & Garten block
 *  rasenSecondary  → 4 smaller articles in the Rasen sidebar
 *  gartenpraxis    → Articles for the rotating 3-col block (Gartenpraxis column)
 *  wissen          → Articles for the rotating 3-col block (Wissen column)
 *  europa          → Articles for the rotating 3-col block (Europa column)
 *  carouselArticles → 6 articles for the 5-card magazine mosaic section
 *  aktuelles       → 3 text-only article cards for the Aktuelles strip
 *  directory       → 8 business logos for the directory widget
 *  events          → Upcoming events for the sidebar events widget
 *  exclusiveArticles → Handpicked "exclusive" articles showcase
 */
import type { PageServerLoad } from './$types.js';
import {
	getArticles,
	getArticlesByCategory,
	getArticleBySlug,
} from '$lib/api/index.js';
import { fetchUpcomingOrRecent } from '$lib/api/events.js';
import { DIRECTORY_ENTRIES } from '$lib/data/directory.js';
import { FALLBACK_ARTICLES, FALLBACK_AUTHORS } from '$lib/api/fallback.js';

export const load: PageServerLoad = async () => {
	// Fetch all data in parallel
	const [
		allArticles,
		gartenpraxis,
		wissen,
		europa,
		pflanzenschutz,
		produktschau,
		rasen,
		aktuelles,
		eventsResult,
	] = await Promise.all([
		getArticles({ limit: 25 }),
		getArticlesByCategory('gartenpraxis', 4),
		getArticlesByCategory('wissen', 4),
		getArticlesByCategory('europa', 4),
		getArticlesByCategory('pflanzenschutz', 4),
		getArticlesByCategory('produktschau', 5),
		getArticlesByCategory('rasen', 5),
		getArticlesByCategory('aktuelles', 3),
		// Upcoming via Tribe REST v1. Falls back to the most recent past
		// events when nothing is scheduled ahead so the widget is never empty.
		fetchUpcomingOrRecent(6),
	]);

	const directory = DIRECTORY_ENTRIES.slice(0, 8);

	// Fetch targeted RasenGartenBlock articles from WP API
	const targetSlugs = [
		'neue-hortensie-runaway-bride',
		'cornus-kuosa-scarlet-fire-blumenhartriegel',
		'neue-katzenminze-nepeta-neptune',
		'der-steppensalbei-salvia-nemorosa-die-besten-sorten',
		'seerosen-in-kleinen-gefaessen',
		'euonymus-japonicus-paloma-blanca',
		'hirse-im-rasen',
		'lebende-alternative-zum-sonnenschirm',
		'die-maulwurfsgrille-oder-werre',
		'hydro-mousse-spruehen-fertig-rasen',
		'der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet'
	];

	const rasenGartenArticles = await Promise.all(
		targetSlugs.map(slug => getArticleBySlug(slug))
	);

	const articleMap = new Map<string, any>();
	targetSlugs.forEach((slug, idx) => {
		const art = rasenGartenArticles[idx];
		if (art) {
			articleMap.set(slug, JSON.parse(JSON.stringify(art)));
		}
	});

	// Find the Japankäfer article:
	const heroSlug = 'kampagne-stopp-japankaefer-lanciert';
	const heroFallbackSlug = 'kampagne-japankaefer-stoppen-lanciert';
	let hero = allArticles.find(a => a.slug === heroSlug || a.slug === heroFallbackSlug);
	if (!hero) {
		const fbHero = FALLBACK_ARTICLES.find(a => a.slug === heroSlug || a.slug === heroFallbackSlug);
		if (fbHero) {
			hero = JSON.parse(JSON.stringify(fbHero));
			if (hero) {
				hero.publishedAt = new Date(fbHero.publishedAt);
			}
		}
	}
	if (hero) {
		hero.title = 'Kampagne «Stopp Japankäfer» lanciert';
		hero.excerpt = 'Der Japankäfer ist ein Schadorganismus, der in der Landwirtschaft grosse Schäden anrichten und ganze Ernten zerstören kann. Aufgrund der bevorstehenden Feiertage und der fortschreitenden Verbreitung des Käfers hierzulande und im angrenzenden Ausland lanciert das Bundesamt für Landwirtschaft (BLW) heute eine Kampagne zur Sensibilisierung der Bürgerinnen und Bürger sowie der Reisenden. Damit soll die Bevölkerung zur Wachsamkeit aufgerufen und die Verbreitung des Käfers verlangsamt werden.';
	} else {
		hero = allArticles[0];
	}

	// Find the Kress Voyager article:
	const voyagerSlug = 'kress-voyager-hohe-maehleistung-fuer-profis';
	let voyager = allArticles.find(a => a.slug === voyagerSlug);
	if (!voyager) {
		const fbVoyager = FALLBACK_ARTICLES.find(a => a.slug === voyagerSlug);
		if (fbVoyager) {
			voyager = JSON.parse(JSON.stringify(fbVoyager));
			if (voyager) {
				voyager.publishedAt = new Date(fbVoyager.publishedAt);
			}
		}
	}
	if (voyager) {
		voyager.title = 'Kress Voyager: hohe Mähleistung für Profis';
	}

	// Remove these two articles from the main list so they don't duplicate
	const filteredArticles = allArticles.filter(a => a.slug !== heroSlug && a.slug !== heroFallbackSlug && a.slug !== voyagerSlug);

	// Helper to find articles by slug from WordPress or fallback
	const findArticleBySlug = (slug: string, fallbackIdx?: number) => {
		// 1. Check direct fetched map
		let art = articleMap.get(slug);
		if (art) return art;

		// 2. Check allArticles
		art = allArticles.find(a => a.slug === slug);
		if (art) return JSON.parse(JSON.stringify(art));

		// 3. Check fallback mock
		const fb = FALLBACK_ARTICLES.find(
			a => a.slug === slug ||
			(slug === 'cornus-kuosa-scarlet-fire-blumenhartriegel' && a.slug === 'cornus-kuosa-scarlet-fire') ||
			(slug === 'der-steppensalbei-salvia-nemorosa-die-besten-sorten' && a.slug === 'der-steppensalbei-salvia-nemorosa') ||
			(slug === 'der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet' && a.slug === 'der-schwarze-diamant-apfel-tibet')
		);
		if (fb) {
			const cloned = JSON.parse(JSON.stringify(fb));
			cloned.publishedAt = new Date(fb.publishedAt);
			if ('updatedAt' in fb) {
				cloned.updatedAt = new Date(fb.updatedAt);
			}
			return cloned;
		}

		// 4. Try index fallback
		if (fallbackIdx !== undefined && allArticles[fallbackIdx]) {
			return JSON.parse(JSON.stringify(allArticles[fallbackIdx]));
		}

		return null;
	};

	// Construct heroSide (2 articles: voyager first, then one from filtered list)
	const heroSide = [];
	if (voyager) {
		heroSide.push(voyager);
	}
	if (filteredArticles.length > 0) {
		heroSide.push(filteredArticles[0]);
	}

	const gridArticles = filteredArticles.slice(1, 4);
	const carouselArticles = filteredArticles.slice(4, 10);
	const rasenMain = rasen[0] ?? filteredArticles[10];
	const rasenSecondary = rasen.slice(1, 5);

	// Curated articles for the three-column RasenGartenBlock
	const col1Main = findArticleBySlug('neue-hortensie-runaway-bride', 10);
	if (col1Main) {
		col1Main.title = 'Neue Hortensie – Runaway Bride';
		col1Main.excerpt = 'Eine neue Hortensie mit dem Namen "Runaway Bride" ( Die Braut die sich nicht traut ) wird von der Firma Cultivaris GmbH vorgestellt. Ihr...';
	}

	const col1Stacked = [
		findArticleBySlug('cornus-kuosa-scarlet-fire-blumenhartriegel', 11),
		findArticleBySlug('neue-katzenminze-nepeta-neptune', 12)
	];
	if (col1Stacked[0]) col1Stacked[0].title = "Cornus kuosa `Scarlet Fire´ – Blumenhartriegel";
	if (col1Stacked[1]) col1Stacked[1].title = "Neue Katzenminze – Nepeta ‚Neptune‘";

	const col2Main = findArticleBySlug('der-steppensalbei-salvia-nemorosa-die-besten-sorten', 13);
	if (col2Main) {
		col2Main.title = 'Der Steppensalbei – Salvia nemorosa- die besten Sorten';
		const authorPeter = FALLBACK_AUTHORS.find(a => a.slug === 'stemalo');
		if (authorPeter && col2Main.author) {
			col2Main.author = authorPeter;
		}
		col2Main.excerpt = 'Er kann als Bodendecker verwendet werden, in kleinen Gruppen im Beet oder auch als attraktiver Rosenbegleiter. Der Steppen-Salbei, Salvia nemorosa. Im Zusammenspiel mit anderen Stauden ist er ein fast unentbehrliches Mitglied im sonnigen Staudenbeet oder auf besonnten Freiflächen.';
	}

	const col2Stacked = [
		findArticleBySlug('seerosen-in-kleinen-gefaessen', 14),
		findArticleBySlug('euonymus-japonicus-paloma-blanca', 15)
	];
	if (col2Stacked[0]) col2Stacked[0].title = "Seerosen in kleinen Gefässen";
	if (col2Stacked[1]) col2Stacked[1].title = "Euonymus japonicus ‚Paloma Blanca‘";

	const sidebarList = [
		{ ...findArticleBySlug('hirse-im-rasen', 16), showGwIcon: true },
		{ ...findArticleBySlug('lebende-alternative-zum-sonnenschirm', 17), showGwIcon: false },
		{ ...findArticleBySlug('die-maulwurfsgrille-oder-werre', 18), showGwIcon: false },
		{ ...findArticleBySlug('hydro-mousse-spruehen-fertig-rasen', 19), showGwIcon: true },
		{ ...findArticleBySlug('neue-hortensie-runaway-bride', 20), showGwIcon: false },
		{ ...findArticleBySlug('der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet', 21), showGwIcon: false }
	].map(item => {
		if (item.slug === 'hirse-im-rasen') item.title = 'Hirse im Rasen';
		if (item.slug === 'hydro-mousse-spruehen-fertig-rasen') item.title = 'Hydro Mousse – sprühen, fertig, Rasen?';
		if (item.slug === 'neue-hortensie-runaway-bride') item.title = 'Neue Hortensie – Runaway Bride';
		if (item.slug === 'der-schwarze-diamant-ein-ungewoehlicher-apfel-aus-tibet' || item.slug === 'der-schwarze-diamant-apfel-tibet') {
			item.title = 'Der schwarze Diamant – ein ungewöhlicher Apfel aus Tibet';
		}
		return item;
	});

	// Exclusive articles
	const exclusiveIds = ['21', '1', '3', '2', '20'];
	const exclusiveArticles = allArticles
		.filter(a => exclusiveIds.includes(a.id))
		.sort((a, b) => exclusiveIds.indexOf(a.id) - exclusiveIds.indexOf(b.id));

	return {
		hero,
		heroSide,
		gridArticles,
		rasenMain,
		rasenSecondary,
		gartenpraxis,
		wissen,
		europa,
		carouselArticles,
		produktschau,
		pflanzenschutz,
		rasenCol: rasen.slice(0, 4),
		aktuelles,
		directory,
		events: eventsResult.events,
		eventsArePast: eventsResult.isPast,
		exclusiveArticles: exclusiveArticles as any,
		rasenGartenBlock: {
			col1Main,
			col1Stacked,
			col2Main,
			col2Stacked,
			sidebarList
		}
	};
};
