import { writable } from 'svelte/store';

interface ModalState {
	loginOpen: boolean;
	searchOpen: boolean;
	activeTab: 'login' | 'register' | 'recover';
}

function createModalStore() {
	const { subscribe, update, set } = writable<ModalState>({
		loginOpen: false,
		searchOpen: false,
		activeTab: 'login'
	});

	return {
		subscribe,
		set,
		update,
		openLogin() {
			update((s) => ({ ...s, loginOpen: true, searchOpen: false, activeTab: 'login' }));
		},
		openRegister() {
			update((s) => ({ ...s, loginOpen: true, searchOpen: false, activeTab: 'register' }));
		},
		openRecover() {
			update((s) => ({ ...s, loginOpen: true, searchOpen: false, activeTab: 'recover' }));
		},
		openSearch() {
			update((s) => ({ ...s, searchOpen: true, loginOpen: false }));
		},
		closeModal() {
			update((s) => ({ ...s, loginOpen: false }));
		},
		closeSearch() {
			update((s) => ({ ...s, searchOpen: false }));
		},
		closeAll() {
			set({ loginOpen: false, searchOpen: false, activeTab: 'login' });
		}
	};
}

export const modalStore = createModalStore();
