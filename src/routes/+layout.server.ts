import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	// ── Weather ──────────────────────────────────────────────────────────────
	let weather = { temp: null as number | null, city: 'Zürich' };
	try {
		const res = await fetch('/api/weather');
		if (res.ok) weather = await res.json();
	} catch {
		// fallback already set
	}

	const user = locals.user
		? {
				id: locals.user.id,
				name: locals.user.name,
				username: locals.user.username,
				email: locals.user.email,
				avatar: locals.user.avatar,
				roles: locals.user.roles,
				isPro: locals.user.isPro
			}
		: null;

	return { weather, user };
};
