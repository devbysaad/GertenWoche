<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';

	interface Props {
		article: ArticlePreview;          // main hero (large, left)
		sideArticles?: ArticlePreview[];  // for mosaic mode (4 corners)
		variant?: 'homepage' | 'mosaic'; // layout variant
	}
	let { article, sideArticles = [], variant = 'mosaic' }: Props = $props();

	const url = $derived(`/${article.urlPath}`);

	// Mosaic: 2 left, 2 right
	const leftArticles = $derived(sideArticles.slice(0, 2));
	const rightArticles = $derived(sideArticles.slice(2, 4));

	// Homepage: 2 stacked right
	const rightStack = $derived(sideArticles.slice(0, 2));
</script>

<!-- ════════════════════════════════════════════════════════
	 HOMEPAGE VARIANT: large left (O) + 2 small stacked right (o / o)
	 ════════════════════════════════════════════════════════ -->
{#if variant === 'homepage'}
<section class="hero-section" aria-label="Hauptartikel">
	<div class="homepage-grid">

		<!-- Large hero left -->
		<a href={url} class="hero-main">
			<div class="hero-img">
				{#if article.thumbnail}
					<img src={article.thumbnail} alt={article.title} loading="eager" />
				{:else}
					<div class="img-ph"></div>
				{/if}
			</div>
			<div class="hero-overlay">
				<span class="cat-badge">{article.category.name}</span>
				<h1 class="hero-title">{article.title}</h1>
				<span class="hero-author">{article.author.name}</span>
			</div>
		</a>

		<!-- 2 small articles stacked right -->
		<div class="right-stack">
			{#each rightStack as art}
				{@const artUrl = `/${art.urlPath}`}
				<a href={artUrl} class="stack-card">
					<div class="stack-img">
						{#if art.thumbnail}
							<img src={art.thumbnail} alt={art.title} loading="lazy" />
						{:else}
							<div class="img-ph"></div>
						{/if}
					</div>
					<div class="stack-overlay">
						<span class="cat-badge sm-badge">{art.category.name}</span>
						<p class="stack-title">{art.title}</p>
					</div>
				</a>
			{/each}
		</div>

	</div>
</section>

<!-- ════════════════════════════════════════════════════════
	 MOSAIC VARIANT: o o / O / o o  (used on category pages)
	 ════════════════════════════════════════════════════════ -->
{:else}
<section class="hero-section" aria-label="Aktuelle Beiträge">
	<div class="mosaic-grid">

		<!-- LEFT COLUMN: 2 small -->
		<div class="mosaic-side">
			{#each leftArticles as art}
				{@const artUrl = `/${art.urlPath}`}
				<a href={artUrl} class="side-card">
					<div class="side-img">
						{#if art.thumbnail}
							<img src={art.thumbnail} alt={art.title} loading="lazy" />
						{:else}
							<div class="img-ph"></div>
						{/if}
					</div>
					<div class="side-overlay">
						<span class="cat-badge sm-badge">{art.category.name}</span>
						<p class="side-title">{art.title}</p>
					</div>
				</a>
			{/each}
		</div>

		<!-- CENTER: large hero -->
		<a href={url} class="mosaic-center">
			<div class="center-img">
				{#if article.thumbnail}
					<img src={article.thumbnail} alt={article.title} loading="eager" />
				{:else}
					<div class="img-ph"></div>
				{/if}
			</div>
			<div class="center-overlay">
				<span class="cat-badge">{article.category.name}</span>
				<h1 class="center-title">{article.title}</h1>
				<span class="center-author">{article.author.name}</span>
			</div>
		</a>

		<!-- RIGHT COLUMN: 2 small -->
		<div class="mosaic-side">
			{#each rightArticles as art}
				{@const artUrl = `/${art.urlPath}`}
				<a href={artUrl} class="side-card">
					<div class="side-img">
						{#if art.thumbnail}
							<img src={art.thumbnail} alt={art.title} loading="lazy" />
						{:else}
							<div class="img-ph"></div>
						{/if}
					</div>
					<div class="side-overlay">
						<span class="cat-badge sm-badge">{art.category.name}</span>
						<p class="side-title">{art.title}</p>
					</div>
				</a>
			{/each}
		</div>

	</div>
</section>
{/if}

<style>
	.hero-section { margin-bottom: 28px; }

	/* ── Category badge (shared) ── */
	.cat-badge {
		display: inline-block;
		background: #F7C900;
		color: #222;
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 2px 7px;
		border-radius: 2px;
		letter-spacing: 0.04em;
	}
	.sm-badge { font-size: 9px; padding: 1px 5px; }

	/* shared image fade overlay */
	.img-ph { width: 100%; height: 100%; background: #333; }

	/* ══════════════════════════════════════
	   HOMEPAGE: large left | 2 small right
	   ══════════════════════════════════════ */
	.homepage-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 4px;
		height: 480px;
	}

	/* Large hero (left) */
	.hero-main {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.hero-img { width: 100%; height: 100%; }
	.hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
	.hero-main:hover .hero-img img { transform: scale(1.02); }

	.hero-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 48px 20px 18px;
		background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
		display: flex; flex-direction: column; gap: 8px;
	}
	.hero-title {
		font-family: 'Roboto', sans-serif;
		font-size: 24px; font-weight: 700;
		color: #fff; margin: 0; line-height: 1.3;
	}
	.hero-author { font-size: 11px; color: rgba(255,255,255,0.75); font-family: 'Roboto', sans-serif; }

	/* 2 small stacked right */
	.right-stack {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 4px;
	}
	.stack-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.stack-img { width: 100%; height: 100%; }
	.stack-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; opacity: 0.88; }
	.stack-card:hover .stack-img img { transform: scale(1.05); opacity: 1; }

	.stack-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 28px 10px 8px;
		background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
		display: flex; flex-direction: column; gap: 4px;
	}
	.stack-title {
		font-family: 'Roboto', sans-serif;
		font-size: 12px; font-weight: 700;
		color: #fff; margin: 0; line-height: 1.3;
		display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
	}

	/* ══════════════════════════════════════
	   MOSAIC: o o / O / o o
	   ══════════════════════════════════════ */
	.mosaic-grid {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 4px;
		height: 480px;
	}

	.mosaic-side {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 4px;
	}

	.side-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.side-img { width: 100%; height: 100%; }
	.side-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; opacity: 0.88; }
	.side-card:hover .side-img img { transform: scale(1.05); opacity: 1; }

	.side-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 28px 10px 8px;
		background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%);
		display: flex; flex-direction: column; gap: 4px;
	}
	.side-title {
		font-family: 'Roboto', sans-serif;
		font-size: 12px; font-weight: 700;
		color: #fff; margin: 0; line-height: 1.3;
		display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
	}

	.mosaic-center {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.center-img { width: 100%; height: 100%; }
	.center-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
	.mosaic-center:hover .center-img img { transform: scale(1.02); }

	.center-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 48px 20px 18px;
		background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
		display: flex; flex-direction: column; gap: 8px;
	}
	.center-title {
		font-family: 'Roboto', sans-serif;
		font-size: 22px; font-weight: 700;
		color: #fff; margin: 0; line-height: 1.3;
	}
	.center-author { font-size: 11px; color: rgba(255,255,255,0.75); font-family: 'Roboto', sans-serif; }

	/* ── MOBILE ── */
	@media (max-width: 900px) {
		.homepage-grid, .mosaic-grid { grid-template-columns: 1fr; height: auto; }
		.mosaic-side, .right-stack { grid-template-rows: auto; grid-template-columns: 1fr 1fr; }
		.side-card, .stack-card { height: 160px; }
		.hero-main, .mosaic-center { height: 280px; order: -1; }
	}
	@media (max-width: 480px) {
		.mosaic-side, .right-stack { grid-template-columns: 1fr; }
		.side-card, .stack-card { height: 140px; }
		.hero-main, .mosaic-center { height: 220px; }
	}
</style>
