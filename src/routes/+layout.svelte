<script lang="ts">
	import '../app.css';
	import HeaderMain from '$lib/components/layout/HeaderMain.svelte';
	import NavPrimary from '$lib/components/layout/NavPrimary.svelte';
	import FooterCTA from '$lib/components/layout/FooterCTA.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';
	import { authStore } from '$lib/stores/auth.store.js';

	let { data, children } = $props();

	$effect(() => {
		if (data.user) {
			authStore.setUser(data.user as any);
		} else {
			authStore.clearUser();
		}
	});
</script>

<!-- Skip to main content (accessibility) -->
<a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>

<!-- Modals -->
<LoginModal open={$modalStore.loginOpen} activeTab={$modalStore.activeTab} />

<!-- Page structure: Header → Nav → Main → FooterCTA → Footer (NO TopBar) -->
<HeaderMain weather={data.weather} />
<NavPrimary />

<main id="main-content">
	{@render children()}
</main>

<FooterCTA />
<Footer />

<style>
	:global(.skip-link) {
		position: absolute;
		left: -9999px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	:global(.skip-link:focus) {
		position: fixed;
		top: 0;
		left: 0;
		width: auto;
		height: auto;
		background: #2D1B69;
		color: #fff;
		padding: 8px 16px;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		z-index: 9999;
		overflow: visible;
	}
</style>
