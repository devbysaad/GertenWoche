import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

// Uses Open-Meteo — free, no API key required
// Zürich coordinates: lat=47.3769, lon=8.5417
const ZURICH_LAT = 47.3769;
const ZURICH_LON = 8.5417;
const OPEN_METEO_URL =
	`https://api.open-meteo.com/v1/forecast?latitude=${ZURICH_LAT}&longitude=${ZURICH_LON}&current=temperature_2m&timezone=Europe%2FZurich`;

export const GET: RequestHandler = async () => {
	try {
		const res = await fetch(OPEN_METEO_URL, {
			signal: AbortSignal.timeout(5000)
		});

		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const data = await res.json();
		const temp = data?.current?.temperature_2m;

		if (typeof temp !== 'number') throw new Error('No temperature in response');

		return json({
			temp: Math.round(temp * 10) / 10,
			city: 'Zürich'
		});
	} catch (err) {
		console.warn('[Weather] Open-Meteo fetch failed:', err);
		return json({ temp: null, city: 'Zürich' });
	}
};
