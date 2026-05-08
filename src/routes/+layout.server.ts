import type { LayoutServerLoad } from './$types.js';
import { getSession } from '$lib/auth/session.js';
import { findById } from '$lib/auth/users.js';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	// ── Weather ──────────────────────────────────────────────────────────────
	let weather = { temp: null as number | null, city: 'Zürich' };
	try {
		const res = await fetch('/api/weather');
		if (res.ok) weather = await res.json();
	} catch {
		// fallback already set
	}

	// ── Auth session ─────────────────────────────────────────────────────────
	let user = null;
	try {
		const session = await getSession(cookies);
		if (session) {
			const stored = findById(session.userId);
			if (stored) {
				user = {
					id: stored.id,
					username: stored.username,
					email: stored.email,
					tier: stored.tier,
					createdAt: new Date(stored.createdAt)
				};
			}
		}
	} catch {
		// invalid or expired session — treat as logged out
	}

	return { weather, user };
};
