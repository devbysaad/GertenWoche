<script lang="ts">
	import HeroSpotlight from "$lib/components/blocks/HeroSpotlight.svelte";
	import RasenGartenBlock from "$lib/components/blocks/RasenGartenBlock.svelte";
	import VideoBlock from "$lib/components/blocks/VideoBlock.svelte";
	import MixedArticleBlock from "$lib/components/blocks/MixedArticleBlock.svelte";
	import MagazineGrid from "$lib/components/blocks/MagazineGrid.svelte";
	import ProductSidebar from "$lib/components/blocks/ProductSidebar.svelte";
	import ThreeColBlock from "$lib/components/blocks/ThreeColBlock.svelte";
	import DirectoryLogos from "$lib/components/blocks/DirectoryLogos.svelte";
	import EventsWidget from "$lib/components/blocks/EventsWidget.svelte";
	import ExclusiveBlock from "$lib/components/blocks/ExclusiveBlock.svelte";
	import ArticleCard from "$lib/components/articles/ArticleCard.svelte";

	let { data } = $props();

	// Rearrange the first 3 gridArticles so the one with the least content is automatically in the center column (Column 2)
	const threeColArticles = $derived.by(() => {
		const articles = data.gridArticles || [];
		if (articles.length < 3) return articles;
		const firstThree = articles.slice(0, 3);
		const getInfoLength = (art: any) => {
			return (art.title?.length || 0) + (art.excerpt?.length || 0);
		};
		// Sort by combined info length ascending
		const sorted = [...firstThree].sort((a, b) => getInfoLength(a) - getInfoLength(b));
		// Place the one with less info (sorted[0]) in the center
		return [sorted[1], sorted[0], sorted[2]];
	});
</script>

<svelte:head>
	<title>Gartenwoche – Das unabhängige Gartenmagazin</title>
	<meta
		name="description"
		content="Gartenwoche ist das unabhängige Schweizer Gartenmagazin. Tipps zu Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten aus der Schweiz."
	/>
	<meta
		property="og:title"
		content="Gartenwoche – Das unabhängige Gartenmagazin"
	/>
	<meta
		property="og:description"
		content="Schweizer Gartenmagazin: Pflanzen, Gartenpraxis, Rasen, Pflanzenschutz und aktuelle Gartennachrichten."
	/>
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

		<!-- ── 3-COL ARTICLE GRID ── -->
		{#if threeColArticles && threeColArticles.length}
			<div class="three-col-grid">
				{#each threeColArticles as article}
					<ArticleCard {article} showExcerpt={true} titleSize="md" variant="three-col" />
				{/each}
			</div>
		{/if}

		<!-- ── Rasen 3-Col Block ── -->
		{#if data.rasenGartenBlock}
			<RasenGartenBlock blockData={data.rasenGartenBlock} />
		{/if}

		<!-- ── Video der Woche (heading is inside VideoBlock) ── -->
		<div class="ad-spacer"></div>
		<VideoBlock />

		<!-- ── 3-col mixed articles ── -->
		<MixedArticleBlock
			gartenpraxis={data.gartenpraxis ?? []}
			wissen={data.wissen ?? []}
			europa={data.europa ?? []}
		/>

		<!-- ── Aktuelles article strip (3 text articles) ── -->
		{#if data.aktuelles?.length}
			<div class="aktuelles-strip">
				{#each data.aktuelles.slice(0, 3) as art}
					<a href="/{art.urlPath}" class="ak-card">
						<span class="ak-cat">{art.category.name}</span>
						<h3 class="ak-title">{art.title}</h3>
						{#if art.excerpt}
							<p class="ak-excerpt">{art.excerpt}</p>
						{/if}
					</a>
				{/each}
			</div>
		{/if}

		<!-- ── Produktvorschläge: heading + magazine grid ── -->
		{#if data.carouselArticles?.length}
			<div class="produkt-section">
				<div class="section-heading-row">
					<h2 class="section-heading">Produktvorschläge</h2>
				</div>
				<!-- Ad space -->
				<div class="ad-spacer"></div>
				<MagazineGrid
					articles={data.carouselArticles}
					showRemaining={false}
				/>
			</div>
		{/if}

		<!-- ── Exclusive block ── -->
		{#if data.exclusiveArticles && data.exclusiveArticles.length >= 5}
			<ExclusiveBlock articles={data.exclusiveArticles} />
		{/if}

		<!-- ── Bottom: large-img article LEFT + 2 text articles RIGHT ── -->
		<div class="bottom-layout">
			<!-- LEFT: 1 article with large image + title + excerpt -->
			{#if data.pflanzenschutz?.[0]}
				{@const art = data.pflanzenschutz[0]}
				{@const artUrl = `/${art.urlPath}`}
				<a href={artUrl} class="bl-main">
					<div class="bl-img">
						{#if art.thumbnail}
							<img
								src={art.thumbnail}
								alt={art.title}
								loading="lazy"
							/>
						{:else}
							<div class="bl-img-ph"></div>
						{/if}
					</div>
					<div class="bl-main-body">
						<span class="bl-badge">{art.category.name}</span>
						<h3 class="bl-main-title">{art.title}</h3>
						{#if art.excerpt}
							<p class="bl-main-excerpt">{art.excerpt}</p>
						{/if}
					</div>
				</a>
			{/if}

			<!-- RIGHT: 2 text-only articles stacked (no image) -->
			<div class="bl-stack">
				{#each (data.produktschau ?? []).slice(0, 2) as art}
					{@const artUrl = `/${art.urlPath}`}
					<a href={artUrl} class="bl-text-card">
						<span class="bl-badge">{art.category.name}</span>
						<h3 class="bl-text-title">{art.title}</h3>
						{#if art.excerpt}
							<p class="bl-text-excerpt">{art.excerpt}</p>
						{/if}
					</a>
				{/each}
			</div>
		</div>

		<!-- ── Branchenverzeichnis + Events side by side ── -->
		<div class="dir-events-row">
			<div class="dir-col">
				<DirectoryLogos entries={data.directory ?? []} />
			</div>
			<div class="events-col">
				<EventsWidget events={data.events ?? []} isPast={data.eventsArePast ?? false} />
			</div>
		</div>
	</div>
</div>

<style>
	.homepage {
		padding: 24px 0 40px;
	}

	/* ── 3-col article grid ───────────────────────────────── */
	.three-col-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin-bottom: 36px;
	}

	/* ── Produktvorschläge heading ──────────────────────── */
	.produkt-section {
		margin-bottom: 32px;
	}

	/* ── Shared centered section heading ─────────────────── */
	.section-heading-row {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 12px 0 10px;
		margin-bottom: 0;
		border-bottom: 3px solid #f7c900;
	}
	.section-heading {
		font-family: "Roboto", sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #222;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: center;
	}

	/* ── Ad spacer (Google Ads placeholder) ──────────────── */
	.ad-spacer {
		height: 32px;
		margin: 12px 0;
		background: transparent;
	}

	/* ── Bottom layout: left image + right 2 text cards ── */
	.bottom-layout {
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 32px;
		align-items: start;
		margin-bottom: 32px;
		padding: 20px;
		background: #f2f2f2;
		border: 1px solid #e0e0e0;
	}

	/* LEFT: large image card */
	.bl-main {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		gap: 0;
	}

	.bl-img {
		overflow: hidden;
		background: #e0e0e0;
	}
	.bl-img img {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		transition: transform 0.35s ease;
	}
	.bl-main:hover .bl-img img {
		transform: scale(1.03);
	}

	.bl-img-ph {
		height: 280px;
		background: linear-gradient(135deg, #e8f4e8 0%, #c8dfc8 100%);
	}

	.bl-main-body {
		padding: 12px 0 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bl-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: "Roboto", sans-serif;
		font-size: 11px;
		font-weight: 700;
		color: #555;
		align-self: flex-start;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}
	.bl-badge::before {
		content: "G+";
		font-size: 9px;
		color: #888;
	}

	.bl-main-title {
		font-family: "Roboto", sans-serif;
		font-size: 17px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
		transition: color 0.15s;
	}
	.bl-main:hover .bl-main-title {
		color: #2d1b69;
	}

	.bl-main-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #555;
		margin: 0;
		line-height: 1.6;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* RIGHT: 2 text-only cards stacked */
	.bl-stack {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.bl-text-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px 0;
		text-decoration: none;
		border-bottom: 1px solid #e0e0e0;
	}
	.bl-text-card:first-child {
		padding-top: 0;
	}
	.bl-text-card:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.bl-text-title {
		font-family: "Roboto", sans-serif;
		font-size: 17px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
		transition: color 0.15s;
	}
	.bl-text-card:hover .bl-text-title {
		color: #2d1b69;
	}

	.bl-text-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #555;
		margin: 0;
		line-height: 1.65;
		display: -webkit-box;
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ── Aktuelles strip (3 text-only article cards) ─────── */
	.aktuelles-strip {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
		height: 415px;
		border: 1px solid #e0e0e0;
		margin-bottom: 28px;
		background: #fff;
		overflow: hidden;
	}
	.ak-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px 20px 22px;
		text-decoration: none;
		border-right: 1px solid #e0e0e0;
		transition: background 0.15s;
	}
	.ak-card:last-child {
		border-right: none;
	}
	.ak-card:hover {
		background: #fafafa;
	}
	.ak-cat {
		font-family: "Roboto", sans-serif;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #777;
	}
	.ak-title {
		font-family: "Roboto", sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
		transition: color 0.15s;
	}
	.ak-card:hover .ak-title {
		color: #2d1b69;
	}
	.ak-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 15px;
		color: #555;
		margin: 0;
		line-height: 1.65;
	}

	/* ── Directory + Events side-by-side ─────────────────── */
	.dir-events-row {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 32px;
		align-items: start;
		margin-bottom: 32px;
	}
	.dir-col {
		min-width: 0;
	}
	.events-col {
		min-width: 0;
	}

	/* ── Responsive ───────────────────────────────────────── */
	@media (max-width: 860px) {
		.bottom-layout {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.three-col-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.bl-stack {
			flex-direction: row;
			gap: 16px;
		}
		.bl-text-card {
			border-bottom: none;
			border-right: 1px solid #e0e0e0;
			padding: 0 16px 0 0;
		}
		.bl-text-card:last-child {
			border-right: none;
			padding-right: 0;
		}
		.aktuelles-strip {
			grid-template-columns: 1fr;
		}
		.ak-card {
			border-right: none;
			border-bottom: 1px solid #e0e0e0;
		}
		.ak-card:last-child {
			border-bottom: none;
		}
		.dir-events-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.three-col-grid {
			grid-template-columns: 1fr;
		}
		.bl-stack {
			flex-direction: column;
		}
		.bl-text-card {
			border-right: none;
			border-bottom: 1px solid #e0e0e0;
			padding: 16px 0;
		}
	}
</style>
