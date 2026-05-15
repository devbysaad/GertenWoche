import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fetchEventBySlug } from '$lib/api/events.js';

export const load: PageServerLoad = async ({ params }) => {
	const event = await fetchEventBySlug(params.slug);
	if (!event) throw error(404, `Veranstaltung "${params.slug}" nicht gefunden`);
	return { event };
};
