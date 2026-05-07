import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ fetch }) => {
	let weather = { temp: null as number | null, city: 'Zürich' };

	try {
		const res = await fetch('/api/weather');
		if (res.ok) {
			weather = await res.json();
		}
	} catch {
		// fallback already set
	}

	return { weather };
};
