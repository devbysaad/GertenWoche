import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getEventBySlug } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params }) => {
	const event = await getEventBySlug(params.slug);
	if (!event) throw error(404, `Veranstaltung "${params.slug}" nicht gefunden`);
	return { event };
};
