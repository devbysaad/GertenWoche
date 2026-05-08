import { writable } from 'svelte/store';

interface WeatherState {
	temp: number | null;
	city: string;
	loading: boolean;
}

function createWeatherStore() {
	const { subscribe, update, set } = writable<WeatherState>({
		temp: null,
		city: 'Zürich',
		loading: false
	});

	return {
		subscribe,
		set,
		update,
		setWeather(temp: number | null, city = 'Zürich') {
			update((s) => ({ ...s, temp, city, loading: false }));
		},
		setLoading(loading: boolean) {
			update((s) => ({ ...s, loading }));
		}
	};
}

export const weatherStore = createWeatherStore();
