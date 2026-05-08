import type { PageServerLoad } from './$types.js';
import { getEvents } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ url }) => {
	const view = url.searchParams.get('view') ?? 'list';
	const events = await getEvents();

	const now = new Date();
	const upcoming = events.filter((e) => e.endDate >= now);
	const past = events.filter((e) => e.endDate < now);

	return { upcoming, past, view };
};
