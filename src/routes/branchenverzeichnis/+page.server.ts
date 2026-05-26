import type { PageServerLoad } from './$types.js';
import { DIRECTORY_ENTRIES } from '$lib/data/directory.js';

export const load: PageServerLoad = async ({ url }) => {
	// Use static data as primary source (WP directory API is not public)
	const entries = DIRECTORY_ENTRIES;
	const search = url.searchParams.get('q') ?? '';
	const catFilter = url.searchParams.get('cat') ?? '';
	const alphaFilter = url.searchParams.get('alpha') ?? '';

	const categories = [...new Set(entries.map((e) => e.category).filter(Boolean))].sort() as string[];

	const filtered = entries.filter((e) => {
		const matchSearch =
			!search ||
			e.name.toLowerCase().includes(search.toLowerCase()) ||
			e.city?.toLowerCase().includes(search.toLowerCase()) ||
			e.description?.toLowerCase().includes(search.toLowerCase());
		const matchCat = !catFilter || e.category === catFilter;
		const matchAlpha = !alphaFilter || e.name.toUpperCase().startsWith(alphaFilter);
		return matchSearch && matchCat && matchAlpha;
	});

	return { entries: filtered, allEntries: entries, categories, search, catFilter, alphaFilter };
};
