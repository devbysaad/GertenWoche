<script lang="ts">
	import HeroSpotlight from '$lib/components/blocks/HeroSpotlight.svelte';
	import FeaturedGrid from '$lib/components/blocks/FeaturedGrid.svelte';
	import PflanzenStrip from '$lib/components/blocks/PflanzenStrip.svelte';
	import RasenGartenBlock from '$lib/components/blocks/RasenGartenBlock.svelte';
	import VideoBlock from '$lib/components/blocks/VideoBlock.svelte';
	import MixedArticleBlock from '$lib/components/blocks/MixedArticleBlock.svelte';
	import RotatingCarousel from '$lib/components/blocks/RotatingCarousel.svelte';
	import ProductSidebar from '$lib/components/blocks/ProductSidebar.svelte';
	import ThreeColBlock from '$lib/components/blocks/ThreeColBlock.svelte';
	import DirectoryLogos from '$lib/components/blocks/DirectoryLogos.svelte';
	import EventsWidget from '$lib/components/blocks/EventsWidget.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Gartenwoche – Das unabhängige Gartenmagazin</title>
	<meta name="description" content="Gartenwoche ist das unabhängige Schweizer Gartenmagazin. Tipps zu Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten aus der Schweiz." />
	<meta property="og:title" content="Gartenwoche – Das unabhängige Gartenmagazin" />
	<meta property="og:description" content="Schweizer Gartenmagazin: Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten." />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://gartenwoche.ch" />
	<script type="application/ld+json">
	{JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Gartenwoche",
		"url": "https://gartenwoche.ch",
		"description": "Das unabhängige Schweizer Gartenmagazin",
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://gartenwoche.ch/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	})}
	</script>
</svelte:head>

<div class="homepage">
	<div class="container">
		<!-- Section 1: Homepage hero — large left (O) + 2 small stacked right (o/o) -->
		{#if data.hero}
			<HeroSpotlight
				article={data.hero}
				sideArticles={data.featured?.slice(0, 2) ?? []}
				variant="homepage"
			/>
		{/if}

		<!-- Section 2: Featured 3-col grid (articles after the 2 used in hero) -->
		{#if data.featured && data.featured.length > 2}
			<FeaturedGrid articles={data.featured.slice(2)} />
		{/if}

		<!-- Section 3: Pflanzenempfehlungen carousel -->
		{#if data.pflanzen?.length}
			<PflanzenStrip articles={data.pflanzen} />
		{/if}

		<!-- Section 4: Rasen 60/40 -->
		{#if data.rasenMain}
			<RasenGartenBlock main={data.rasenMain} secondary={data.rasenSecondary ?? []} />
		{/if}

		<!-- Section 5: Video der Woche -->
		<VideoBlock />

		<!-- Section 6: 3-col Gartenpraxis / Wissen / Europa -->
		<MixedArticleBlock
			gartenpraxis={data.gartenpraxis ?? []}
			wissen={data.wissen ?? []}
			europa={data.europa ?? []}
		/>

		<!-- Section 7: Rotating carousel -->
		{#if data.carouselArticles?.length}
			<RotatingCarousel articles={data.carouselArticles} />
		{/if}

		<!-- Sections 8-11: 2/3 + 1/3 layout -->
		<div class="bottom-layout">
			<div class="bottom-main">
				<!-- Section 9: 3-col Pflanzenschutz / Produktschau / Rasen -->
				<ThreeColBlock
					pflanzenschutz={data.pflanzenschutz ?? []}
					produktschau={data.produktschau ?? []}
					rasen={data.rasenCol ?? []}
				/>

				<!-- Section 10: Directory logos -->
				<DirectoryLogos entries={data.directory ?? []} />
			</div>

			<div class="bottom-sidebar">
				<!-- Section 8: Product sidebar -->
				<ProductSidebar articles={data.produktschau ?? []} />

				<!-- Section 11: Events -->
				<div style="margin-top: 20px;">
					<EventsWidget events={data.events ?? []} />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.homepage {
		padding: 24px 0 40px;
	}

	.bottom-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 24px;
		align-items: start;
	}

	.bottom-main {
		min-width: 0;
	}

	.bottom-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
	}

	@media (max-width: 1023px) {
		.bottom-layout {
			grid-template-columns: 1fr;
		}

		.bottom-sidebar {
			position: static;
		}
	}
</style>
