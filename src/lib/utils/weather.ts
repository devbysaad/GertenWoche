export interface WeatherData {
	temp: number | null;
	city: string;
}

/**
 * Fetch weather from OpenWeatherMap for a given city.
 * Returns null values if the API key is missing or the request fails.
 */
export async function fetchWeather(city = 'Zurich'): Promise<WeatherData> {
	const apiKey = import.meta.env.WEATHER_API_KEY as string | undefined;

	if (!apiKey || apiKey === 'placeholder_key') {
		return { temp: null, city: 'Zürich' };
	}

	try {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		return {
			temp: Math.round(data.main.temp * 10) / 10,
			city: 'Zürich'
		};
	} catch (err) {
		console.warn('[Weather] Failed to fetch weather:', err);
		return { temp: null, city: 'Zürich' };
	}
}
