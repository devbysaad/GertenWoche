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

		<!-- LEFT: 70% — pure image, no overlay, no gradient -->
		<a href={url} class="hero-img-link" tabindex="0">
			{#if article.thumbnail}
				<img
					src={article.thumbnail}
					alt={article.title}
					loading="eager"
					class="hero-img"
				/>
			{:else}
				<div class="hero-img hero-img-ph"></div>
			{/if}
		</a>

		<!-- RIGHT: 30% — mint text panel -->
		<div class="hero-text-panel">
			<span class="hero-cat-badge">{article.category.name}</span>
			<a href={url} class="hero-title-link">
				<h1 class="hero-title">{article.title}</h1>
			</a>
			<p class="hero-author">{article.author.name}</p>
			{#if article.excerpt}
				<p class="hero-excerpt">{article.excerpt}</p>
			{/if}
			<a href={url} class="hero-read-more">Mehr lesen →</a>
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
	   HOMEPAGE: 70% image | 30% text panel
	   ══════════════════════════════════════ */
	.homepage-grid {
		display: grid;
		grid-template-columns: 70% 30%;
		gap: 0;
		height: 460px;
		margin-bottom: 28px;
	}

	/* LEFT: pure image link — no overlay, no gradient */
	.hero-img-link {
		display: block;
		overflow: hidden;
		height: 100%;
		text-decoration: none;
	}
	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 0;
		transition: transform 0.4s ease;
	}
	.hero-img-link:hover .hero-img { transform: scale(1.02); }
	.hero-img-ph {
		width: 100%;
		height: 100%;
		background: #e0e0e0;
	}

	/* RIGHT: mint-tinted text panel */
	.hero-text-panel {
		background: rgba(200, 230, 210, 0.18);
		border-left: 1px solid rgba(0, 0, 0, 0.06);
		padding: 28px 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow: hidden;
	}

	/* Badge */
	.hero-cat-badge {
		display: inline-block;
		background: #F7C900;
		color: #2D1B69;
		font-family: 'Roboto', sans-serif;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 8px;
		border-radius: 2px;
		align-self: flex-start;
	}

	/* Title */
	.hero-title-link { text-decoration: none; }
	.hero-title {
		font-family: 'Roboto', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}
	.hero-title-link:hover .hero-title { color: #2D1B69; }

	/* Author */
	.hero-author {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #555;
		margin: 0;
	}

	/* Excerpt */
	.hero-excerpt {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #444;
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Read more */
	.hero-read-more {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #2D1B69;
		text-decoration: none;
		margin-top: auto;
		transition: opacity 0.15s;
	}
	.hero-read-more:hover { opacity: 0.7; }

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
		.homepage-grid {
			grid-template-columns: 1fr;
			grid-template-rows: 300px auto;
			height: auto;
		}
		.hero-img-link { height: 300px; }
		.hero-text-panel { padding: 20px 16px; }
		.mosaic-grid { grid-template-columns: 1fr; height: auto; }
		.mosaic-side { grid-template-rows: auto; grid-template-columns: 1fr 1fr; }
		.side-card { height: 160px; }
		.mosaic-center { height: 280px; order: -1; }
	}
	@media (max-width: 480px) {
		.mosaic-side { grid-template-columns: 1fr; }
		.side-card { height: 140px; }
		.mosaic-center { height: 220px; }
		.hero-img-link { height: 220px; }
	}
</style>
