import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Allow `?redirect=` only for in-app destinations. */
function safeRedirect(target: string | null): string {
	if (!target) return '/mein-konto';
	if (!target.startsWith('/') || target.startsWith('//')) return '/mein-konto';
	return target;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const next = safeRedirect(url.searchParams.get('redirect'));

	// Already logged in → bounce immediately. Keeps this page from
	// flashing the login form to authenticated users.
	if (locals.user) throw redirect(303, next);

	return {
		next,
		initialTab: (url.searchParams.get('tab') === 'register' ? 'register' : 'login') as
			| 'login'
			| 'register'
	};
};
