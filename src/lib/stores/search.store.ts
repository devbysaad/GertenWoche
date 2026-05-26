import { writable } from 'svelte/store';
import type { ArticlePreview } from '$lib/types/index.js';

interface SearchState {
	query: string;
	results: ArticlePreview[];
	loading: boolean;
}

function createSearchStore() {
	const { subscribe, update, set } = writable<SearchState>({
		query: '',
		results: [],
		loading: false
	});

	return {
		subscribe,
		set,
		update,
		setQuery(query: string) {
			update((s) => ({ ...s, query }));
		},
		setResults(results: ArticlePreview[]) {
			update((s) => ({ ...s, results, loading: false }));
		},
		setLoading(loading: boolean) {
			update((s) => ({ ...s, loading }));
		},
		clearSearch() {
			set({ query: '', results: [], loading: false });
		}
	};
}

export const searchStore = createSearchStore();
