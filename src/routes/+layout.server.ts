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

	// ── Auth session (via better-auth, set in hooks.server.ts) ───────────────
	// locals.user is populated by the hooks.server.ts handle() function
	const user = locals.user
		? {
				id:        locals.user.id,
				name:      locals.user.name,
				email:     locals.user.email,
				tier:      'free' as const, // extend with DB role lookup when needed
				createdAt: new Date(locals.user.createdAt)
			}
		: null;

	return { weather, user };
};
