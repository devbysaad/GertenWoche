/**
 * @file +page.server.ts — Homepage Data Loader
 * ─────────────────────────────────────────────────────────
 * Fetches ALL homepage data in parallel via Promise.all() for performance.
 * The returned object is available in +page.svelte as `let { data } = $props()`.
 *
 * Data slots:
 *  hero            → Main large hero image article (left side)
 *  heroSide        → 2 articles stacked on the right of the hero
 *  featuredOne     → 1 featured article directly below hero
 *  gridArticles    → 3 articles for the 3-column article grid
 *  pflanzen        → 8 articles for the Pflanzenempfehlungen carousel
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
} from '$lib/api/index.js';
import { fetchEvents } from '$lib/api/events.js';
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
		aktuelles,
		events,
	] = await Promise.all([
		getArticles({ limit: 25 }),
		getArticlesByCategory('pflanzenempfehlungen', 8),
		getArticlesByCategory('gartenpraxis', 4),
		getArticlesByCategory('wissen', 4),
		getArticlesByCategory('europa', 4),
		getArticlesByCategory('pflanzenschutz', 4),
		getArticlesByCategory('produktschau', 5),
		getArticlesByCategory('rasen', 5),
		getArticlesByCategory('aktuelles', 3),
		fetchEvents(),   // upcoming events via Tribe REST v1
	]);

	const directory = DIRECTORY_ENTRIES.slice(0, 8);

	// ── Article slots (no overlaps) ──────────────────────────
	const hero = allArticles[0];          // main hero image (left)
	const heroSide = allArticles.slice(1, 3); // 2 right-stacked articles in hero
	const featuredOne = allArticles[3];           // 1 featured article below hero
	const gridArticles = allArticles.slice(4, 7);  // 3-col grid (3 articles)
	const carouselArticles = allArticles.slice(7, 13); // 6 articles → 5-card mosaic + 1 below
	const rasenMain = rasen[0] ?? allArticles[10];
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
		aktuelles,
		directory,
		events,
		exclusiveArticles,
	};
};
