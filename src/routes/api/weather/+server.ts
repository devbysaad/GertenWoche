/**
 * Weather API — Open-Meteo proxy for Zürich.
 *
 * Open-Meteo is free with no API key, but rate-limits the IP on burst traffic
 * (HTTP 429). This handler:
 *
 *  1. Serves from an in-memory cache for TTL.WEATHER (15 min) so a normal page
 *     render does NOT round-trip to Open-Meteo.
 *  2. On upstream failure (429 / timeout / network) keeps serving the
 *     last-known-good temperature instead of `null`, so the header strip
 *     never falls back to "—°C" once we've successfully fetched once.
 *  3. Sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=900`
 *     so Vercel / browsers also keep a copy for ~5 min.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getCached, setCached, TTL } from '$lib/api/cache.js';

const ZURICH_LAT = 47.3769;
const ZURICH_LON = 8.5417;
const OPEN_METEO_URL =
	`https://api.open-meteo.com/v1/forecast?latitude=${ZURICH_LAT}&longitude=${ZURICH_LON}&current=temperature_2m&timezone=Europe%2FZurich`;
const FETCH_TIMEOUT_MS = 5_000;
const CACHE_KEY = 'weather:zurich';
// Stale fallback survives much longer than the fresh cache so a multi-minute
// upstream outage doesn't blank the topbar.
const STALE_KEY = 'weather:zurich:stale';
const STALE_TTL = 24 * 60 * 60_000;

interface WeatherPayload {
	temp: number | null;
	city: string;
	stale?: boolean;
}

export const GET: RequestHandler = async () => {
	const fresh = getCached<WeatherPayload>(CACHE_KEY);
	if (fresh) return weatherResponse(fresh);

	try {
		const res = await fetch(OPEN_METEO_URL, {
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const data = await res.json();
		const raw = data?.current?.temperature_2m;
		if (typeof raw !== 'number' || Number.isNaN(raw)) {
			throw new Error('No temperature in response');
		}

		const payload: WeatherPayload = {
			temp: Math.round(raw * 10) / 10,
			city: 'Zürich'
		};
		setCached(CACHE_KEY, payload, TTL.WEATHER);
		setCached(STALE_KEY, payload, STALE_TTL);
		return weatherResponse(payload);
	} catch (err) {
		const stale = getCached<WeatherPayload>(STALE_KEY);
		if (stale) {
			console.warn(
				'[Weather] Open-Meteo fetch failed — serving stale value:',
				err instanceof Error ? err.message : err
			);
			return weatherResponse({ ...stale, stale: true });
		}
		console.warn(
			'[Weather] Open-Meteo fetch failed (no stale value available):',
			err instanceof Error ? err.message : err
		);
		return weatherResponse({ temp: null, city: 'Zürich' });
	}
};

function weatherResponse(payload: WeatherPayload) {
	return json(payload, {
		headers: {
			'Cache-Control':
				'public, s-maxage=300, max-age=60, stale-while-revalidate=900'
		}
	});
}
