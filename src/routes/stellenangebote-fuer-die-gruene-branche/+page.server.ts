import type { PageServerLoad } from './$types.js';
import { fetchJobListings } from '$lib/api/jobs.js';

export const load: PageServerLoad = async ({ url }) => {
	const keyword  = url.searchParams.get('keyword')  ?? '';
	const location = url.searchParams.get('location') ?? '';
	const type     = url.searchParams.get('type')     ?? '';
	const page     = parseInt(url.searchParams.get('page') ?? '1', 10);

	const jobs = await fetchJobListings({ keyword, location, type, page });

	return {
		jobs,
		filter: { keyword, location, type, page },
		isEmpty: jobs.length === 0
	};
};
