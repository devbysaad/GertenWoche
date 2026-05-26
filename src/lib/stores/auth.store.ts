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
		},

		/** Call after successful login API response */
		async login(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username, password }), // WP JWT needs `username`
					credentials: 'include'
				});
				const data = await res.json();
				if (!res.ok) {
					update((s) => ({ ...s, loading: false }));
					return { ok: false, error: data.error ?? data.message ?? 'Anmeldung fehlgeschlagen' };
				}
				update((s) => ({ ...s, user: data.user, loading: false }));
				return { ok: true };
			} catch {
				update((s) => ({ ...s, loading: false }));
				return { ok: false, error: 'Netzwerkfehler' };
			}
		},

		async register(payload: {
			email: string;
			password: string;
			username?: string;
			displayName?: string;
			firstName?: string;
			lastName?: string;
		}): Promise<{ ok: boolean; error?: string }> {
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch('/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
					credentials: 'include'
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					update((s) => ({ ...s, loading: false }));
					return { ok: false, error: data?.error ?? data?.message ?? 'Registrierung fehlgeschlagen' };
				}
				update((s) => ({ ...s, user: data.user, loading: false }));
				return { ok: true };
			} catch {
				update((s) => ({ ...s, loading: false }));
				return { ok: false, error: 'Netzwerkfehler' };
			}
		},

		async logout(): Promise<void> {
			try {
				await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
			} catch {
				// Even if the server call fails, drop local state and navigate home.
			}
			update((s) => ({ ...s, user: null }));
			window.location.href = '/';
		}
	};
}

export const authStore = createAuthStore();
