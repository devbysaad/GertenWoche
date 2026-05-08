import type { PageServerLoad } from './$types.js';
import { getDirectoryEntries } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ url }) => {
	const entries = await getDirectoryEntries();
	const search = url.searchParams.get('q') ?? '';
	const catFilter = url.searchParams.get('cat') ?? '';

	const categories = [...new Set(entries.map((e) => e.category).filter(Boolean))].sort() as string[];

	const filtered = entries.filter((e) => {
		const matchSearch =
			!search ||
			e.name.toLowerCase().includes(search.toLowerCase()) ||
			e.city?.toLowerCase().includes(search.toLowerCase()) ||
			e.description?.toLowerCase().includes(search.toLowerCase());
		const matchCat = !catFilter || e.category === catFilter;
		return matchSearch && matchCat;
	});

	return { entries: filtered, allEntries: entries, categories, search, catFilter };
};
