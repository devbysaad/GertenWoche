import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { loadUserData } from '$lib/server/userStore';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to login page if not authenticated
	if (!locals.user) {
		throw redirect(302, '/anmelden-registrieren');
	}

	// Load whatever profile + billing data we already have on disk for this
	// user, with sensible WP-side fallbacks so the form is never empty.
	const stored = loadUserData(locals.user.id);

	const [wpFirst = '', ...wpRest] = (locals.user.name ?? '').split(' ');

	const profile = {
		first_name:   stored.profile.first_name   || wpFirst,
		last_name:    stored.profile.last_name    || wpRest.join(' '),
		display_name: stored.profile.display_name || locals.user.name || locals.user.username || '',
		email:        stored.profile.email        || locals.user.email || ''
	};

	const billing = {
		...stored.billing,
		email: stored.billing.email || locals.user.email || ''
	};

	return { user: locals.user, profile, billing };
};
