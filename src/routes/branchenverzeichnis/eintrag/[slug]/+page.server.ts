import type { PageServerLoad } from './$types.js';
import { DIRECTORY_ENTRIES } from '$lib/data/directory.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const entry = DIRECTORY_ENTRIES.find((e) => e.slug === params.slug);
	if (!entry) throw error(404, 'Eintrag nicht gefunden');
	return { entry };
};
