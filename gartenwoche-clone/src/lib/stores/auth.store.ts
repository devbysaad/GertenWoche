import { writable } from 'svelte/store';
import type { User } from '$lib/types/index.js';

interface AuthState {
	user: User | null;
	loading: boolean;
}

function createAuthStore() {
	const { subscribe, update, set } = writable<AuthState>({
		user: null,
		loading: false
	});

	return {
		subscribe,
		set,
		update,
		setUser(user: User) {
			update((s) => ({ ...s, user, loading: false }));
		},
		clearUser() {
			update((s) => ({ ...s, user: null, loading: false }));
		},
		setLoading(loading: boolean) {
			update((s) => ({ ...s, loading }));
		}
	};
}

export const authStore = createAuthStore();
