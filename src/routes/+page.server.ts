import type { PageServerLoad } from './$types.js';
import {
	getArticles,
	getArticlesByCategory,
	getEvents,
} from '$lib/api/index.js';
import { DIRECTORY_ENTRIES } from '$lib/data/directory.js';

export const load: PageServerLoad = async () => {
	// Fetch all data in parallel
	const [
		allArticles,
		pflanzen,
		gartenpraxis,
		wissen,
		europa,
		pflanzenschutz,
		produktschau,
		rasen,
		events,
	] = await Promise.all([
		getArticles({ limit: 20 }),
		getArticlesByCategory('pflanzenempfehlungen', 8),
		getArticlesByCategory('gartenpraxis', 4),
		getArticlesByCategory('wissen', 4),
		getArticlesByCategory('europa', 4),
		getArticlesByCategory('pflanzenschutz', 4),
		getArticlesByCategory('produktschau', 5),
		getArticlesByCategory('rasen', 5),
		getEvents(),
	]);

	const directory = DIRECTORY_ENTRIES.slice(0, 8);

	// ── Article slots (no overlaps) ──────────────────────────
	const hero           = allArticles[0];          // main hero image (left)
	const heroSide       = allArticles.slice(1, 3); // 2 right-stacked articles in hero
	const featuredOne    = allArticles[3];           // 1 featured article below hero
	const gridArticles   = allArticles.slice(4, 7);  // 3-col grid (3 articles)
	const carouselArticles = allArticles.slice(7, 10);
	const rasenMain      = rasen[0] ?? allArticles[10];
	const rasenSecondary = rasen.slice(1, 5);

	// Exclusive articles
	const exclusiveIds = ['21', '1', '3', '2', '20'];
	const exclusiveArticles = allArticles
		.filter(a => exclusiveIds.includes(a.id))
		.sort((a, b) => exclusiveIds.indexOf(a.id) - exclusiveIds.indexOf(b.id));

	return {
		hero,
		heroSide,
		featuredOne,
		gridArticles,
		pflanzen,
		rasenMain,
		rasenSecondary,
		gartenpraxis,
		wissen,
		europa,
		carouselArticles,
		produktschau,
		pflanzenschutz,
		rasenCol: rasen.slice(0, 4),
		directory,
		events,
		exclusiveArticles,
	};
};
