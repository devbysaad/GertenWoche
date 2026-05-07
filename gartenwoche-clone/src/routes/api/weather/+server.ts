import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
	const apiKey = import.meta.env.WEATHER_API_KEY as string | undefined;

	if (!apiKey || apiKey === 'placeholder_key') {
		return json({ temp: null, city: 'Zürich' });
	}

	try {
		const res = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=Zurich&appid=${apiKey}&units=metric`
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return json({
			temp: Math.round(data.main.temp * 10) / 10,
			city: 'Zürich'
		});
	} catch (err) {
		console.warn('[Weather API] Failed:', err);
		return json({ temp: null, city: 'Zürich' });
	}
};
