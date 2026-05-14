<script lang="ts">
	import '../app.css';
	import HeaderMain from '$lib/components/layout/HeaderMain.svelte';
	import NavPrimary from '$lib/components/layout/NavPrimary.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import LoginModal from '$lib/components/ui/LoginModal.svelte';
	import AdSidebar from '$lib/components/ui/AdSidebar.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';
	import { authStore } from '$lib/stores/auth.store.js';
	import { organizationSchema, websiteSchema } from '$lib/utils/seo.js';

	let { data, children } = $props();

	$effect(() => {
		if (data.user) {
			authStore.setUser(data.user as any);
		} else {
			authStore.clearUser();
		}
	});
</script>

<svelte:head>
	<!-- Default title (overridden per-page) -->
	<title>Gartenwoche – Das unabhängige Gartenmagazin</title>
	<meta name="description" content="Gartenwoche – Ihr Schweizer Gartenmagazin für Pflanzen, Gartenpraxis, Aktuelles und Veranstaltungen." />
	<link rel="canonical" href="https://gartenwoche.ch" />
	<meta name="robots" content="max-image-preview:large" />

	<!-- Default OpenGraph -->
	<meta property="og:title" content="Gartenwoche – Das unabhängige Gartenmagazin" />
	<meta property="og:description" content="Gartenwoche – Ihr Schweizer Gartenmagazin für Pflanzen, Gartenpraxis, Aktuelles und Veranstaltungen." />
	<meta property="og:image" content="https://gartenwoche.ch/Logo_Gartenwoche-1.png" />
	<meta property="og:url" content="https://gartenwoche.ch" />
	<meta property="og:type" content="website" />

	<!-- JSON-LD: Organization + WebSite (present on every page) -->
	{@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`}
</svelte:head>

<!-- Skip to main content (accessibility) -->
<a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>

<!-- Modals -->
<LoginModal open={$modalStore.loginOpen} activeTab={$modalStore.activeTab} />

<!-- Fixed sidebar ads (only visible at 1540px+) -->
<AdSidebar position="left" />
<AdSidebar position="right" />

<!-- Page structure: Header → Nav → Main → Footer -->
<HeaderMain weather={data.weather} user={data.user} />
<NavPrimary />

<main id="main-content">
	{@render children()}
</main>

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
