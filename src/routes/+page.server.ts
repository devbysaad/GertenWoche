import type { PageServerLoad } from './$types.js';
import {
	getArticles,
	getArticlesByCategory,
	getEvents,
	getDirectoryEntries
} from '$lib/api/index.js';

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
		directory
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
		getDirectoryEntries()
	]);

	const hero = allArticles[0];
	const featured = allArticles.slice(1, 5);
	const carouselArticles = allArticles.slice(5, 8);
	const rasenMain = rasen[0] ?? allArticles[8];
	const rasenSecondary = rasen.slice(1, 5);

	return {
		hero,
		featured,
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
		events
	};
};
