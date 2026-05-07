<script lang="ts">
	import '../app.css';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import HeaderMain from '$lib/components/layout/HeaderMain.svelte';
	import NavPrimary from '$lib/components/layout/NavPrimary.svelte';
	import FooterCTA from '$lib/components/layout/FooterCTA.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';

	let { data, children } = $props();
</script>

<!-- Skip to main content (accessibility) -->
<a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>

<!-- Modals (rendered outside flow) -->
<LoginModal
	open={$modalStore.loginOpen}
	activeTab={$modalStore.activeTab}
/>
<SearchBar open={$modalStore.searchOpen} />

<!-- Page structure -->
<TopBar />
<HeaderMain weather={data.weather} />
<NavPrimary />

<main id="main-content">
	{@render children()}
</main>

<FooterCTA />
<Footer />
