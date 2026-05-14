<script lang="ts">
	import HeroSpotlight from '$lib/components/blocks/HeroSpotlight.svelte';
	import PflanzenStrip from '$lib/components/blocks/PflanzenStrip.svelte';
	import RasenGartenBlock from '$lib/components/blocks/RasenGartenBlock.svelte';
	import VideoBlock from '$lib/components/blocks/VideoBlock.svelte';
	import MixedArticleBlock from '$lib/components/blocks/MixedArticleBlock.svelte';
	import RotatingCarousel from '$lib/components/blocks/RotatingCarousel.svelte';
	import ProductSidebar from '$lib/components/blocks/ProductSidebar.svelte';
	import ThreeColBlock from '$lib/components/blocks/ThreeColBlock.svelte';
	import DirectoryLogos from '$lib/components/blocks/DirectoryLogos.svelte';
	import EventsWidget from '$lib/components/blocks/EventsWidget.svelte';
	import ExclusiveBlock from '$lib/components/blocks/ExclusiveBlock.svelte';
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';

	let { data } = $props();

	// Discover more accordion
	const discoverCategories = [
		{ label: 'Ausstellungen und Messen', href: '/veranstaltungen' },
		{ label: 'Gartenpraxis', href: '/category/gartenpraxis/' },
		{ label: 'Hof, Terrasse und Vorgarten', href: '/category/gartenpraxis/' },
	];
	let openDiscover = $state<number | null>(null);
</script>

<svelte:head>
	<title>Gartenwoche – Das unabhängige Gartenmagazin</title>
	<meta name="description" content="Gartenwoche ist das unabhängige Schweizer Gartenmagazin. Tipps zu Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten aus der Schweiz." />
	<meta property="og:title" content="Gartenwoche – Das unabhängige Gartenmagazin" />
	<meta property="og:description" content="Schweizer Gartenmagazin: Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten." />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://gartenwoche.ch" />
</svelte:head>

<div class="homepage">
	<div class="container">

		<!-- ── HERO: large left image + 2 stacked right articles ── -->
		{#if data.hero}
			<HeroSpotlight
				article={data.hero}
				sideArticles={data.heroSide ?? []}
				variant="homepage"
			/>
		{/if}

		<!-- ── FEATURED ONE: single article with image below hero ── -->
		{#if data.featuredOne}
			{@const art = data.featuredOne}
			{@const url = `/${art.urlPath}`}
			<div class="featured-one">
				<a href={url} class="fo-inner">
					<div class="fo-img">
						{#if art.thumbnail}
							<img src={art.thumbnail} alt={art.title} loading="lazy" />
						{:else}
							<div class="fo-img-ph"></div>
						{/if}
						<span class="fo-badge">{art.category.name}</span>
					</div>
					<div class="fo-body">
						<h2 class="fo-title">{art.title}</h2>
						{#if art.excerpt}
							<p class="fo-excerpt">{art.excerpt}</p>
						{/if}
						<span class="fo-author">Editorial Team {art.author.name}</span>
					</div>
				</a>
			</div>
		{/if}

		<!-- ── DISCOVER MORE accordion ── -->
		<div class="discover-more">
			<h2 class="dm-heading">Entdecken Sie mehr</h2>
			<ul class="dm-list">
				{#each discoverCategories as cat, i}
					<li class="dm-item">
						<a href={cat.href} class="dm-link">
							<span>{cat.label}</span>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
								<polyline points="9 18 15 12 9 6"/>
							</svg>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- ── 3-COL ARTICLE GRID ── -->
		{#if data.gridArticles?.length}
			<div class="three-col-grid">
				{#each data.gridArticles.slice(0, 3) as article}
					<ArticleCard {article} showExcerpt={true} titleSize="md" />
				{/each}
			</div>
		{/if}

		<!-- ── Pflanzenempfehlungen carousel ── -->
		{#if data.pflanzen?.length}
			<PflanzenStrip articles={data.pflanzen} />
		{/if}

		<!-- ── Rasen 60/40 ── -->
		{#if data.rasenMain}
			<RasenGartenBlock main={data.rasenMain} secondary={data.rasenSecondary ?? []} />
		{/if}

		<!-- ── Video der Woche ── -->
		<VideoBlock />

		<!-- ── 3-col mixed articles ── -->
		<MixedArticleBlock
			gartenpraxis={data.gartenpraxis ?? []}
			wissen={data.wissen ?? []}
			europa={data.europa ?? []}
		/>

		<!-- ── Rotating carousel ── -->
		{#if data.carouselArticles?.length}
			<RotatingCarousel articles={data.carouselArticles} />
		{/if}

		<!-- ── Exclusive block ── -->
		{#if data.exclusiveArticles && data.exclusiveArticles.length >= 5}
			<ExclusiveBlock articles={data.exclusiveArticles} />
		{/if}

		<!-- ── Bottom: 2/3 main + 1/3 sidebar ── -->
		<div class="bottom-layout">
			<div class="bottom-main">
				<ThreeColBlock
					pflanzenschutz={data.pflanzenschutz ?? []}
					produktschau={data.produktschau ?? []}
					rasen={data.rasenCol ?? []}
				/>
				<DirectoryLogos entries={data.directory ?? []} />
			</div>

			<div class="bottom-sidebar">
				<ProductSidebar articles={data.produktschau ?? []} />
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

	/* ── Featured One ─────────────────────────────────────── */
	.featured-one {
		margin-bottom: 8px;
	}

	.fo-inner {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 0;
		text-decoration: none;
		border: 1px solid #E0E0E0;
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}
	.fo-inner:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }

	.fo-img {
		position: relative;
		overflow: hidden;
		background: #e0e0e0;
	}
	.fo-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		min-height: 180px;
		transition: transform 0.3s ease;
	}
	.fo-inner:hover .fo-img img { transform: scale(1.04); }

	.fo-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		background: rgba(0,0,0,0.65);
		color: #fff;
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 8px;
		border-radius: 2px;
	}

	.fo-body {
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		justify-content: center;
		background: #fff;
	}

	.fo-title {
		font-family: 'Roboto', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
	}

	.fo-excerpt {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: #555;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.fo-author {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #888;
		font-style: italic;
	}

	/* ── Discover More ────────────────────────────────────── */
	.discover-more {
		background: #f5f5f5;
		border: 1px solid #E0E0E0;
		padding: 16px 20px;
		margin: 20px 0;
	}

	.dm-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 0 0 8px;
	}

	.dm-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.dm-item {
		border-top: 1px solid #E0E0E0;
	}

	.dm-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
		text-decoration: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		transition: color 0.15s;
	}
	.dm-link:hover { color: #222; }
	.dm-link svg { color: #aaa; flex-shrink: 0; }

	/* ── 3-col article grid ───────────────────────────────── */
	.three-col-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin-bottom: 32px;
	}

	/* ── Bottom layout ────────────────────────────────────── */
	.bottom-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 24px;
		align-items: start;
	}

	.bottom-main { min-width: 0; }

	.bottom-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
	}

	/* ── Responsive ───────────────────────────────────────── */
	@media (max-width: 1023px) {
		.bottom-layout { grid-template-columns: 1fr; }
		.bottom-sidebar { position: static; }
	}

	@media (max-width: 860px) {
		.fo-inner { grid-template-columns: 1fr; }
		.fo-img img { min-height: 220px; }
		.three-col-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 560px) {
		.three-col-grid { grid-template-columns: 1fr; }
		.fo-body { padding: 14px 16px; }
	}
</style>
