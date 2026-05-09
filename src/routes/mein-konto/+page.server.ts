import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to login page if not authenticated
	if (!locals.user) {
		throw redirect(302, '/anmelden-registrieren');
	}
	return { user: locals.user };
};
