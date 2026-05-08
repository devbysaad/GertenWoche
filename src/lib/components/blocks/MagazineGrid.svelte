<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import { formatGermanDate } from '$lib/utils/date.js';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	// First 5 go into magazine layout, rest into 3-col grid
	const featured = $derived(articles.slice(0, 5));
	const remaining = $derived(articles.slice(5));
</script>

<!-- ══════════════════════════════════════════════════════
	 MAGAZINE GRID — 5 cards, center tall (spans 2 rows)
	 Layout:  [1] [  2  ] [3]
	          [4] [  2  ] [5]
	 ══════════════════════════════════════════════════════ -->
{#if featured.length > 0}
<div class="magazine-grid">
	{#each featured as article, i}
		{@const url = `/${article.urlPath}`}
		{@const dateStr = formatGermanDate(article.publishedAt)}
		<a
			href={url}
			class="mag-card"
			class:tall={i === 1}
			style="grid-column:{[1,2,3,1,3][i]};grid-row:{i===1?'1/span 2':i<3?'1':'2'}"
		>
			<!-- Full-bleed image -->
			<div class="mag-img">
				{#if article.thumbnail}
					<img src={article.thumbnail} alt={article.title} loading={i === 0 ? 'eager' : 'lazy'} />
				{:else}
					<div class="img-ph"></div>
				{/if}
			</div>

			<!-- Dark gradient + text overlay at bottom -->
			<div class="mag-overlay">
				<!-- Category badge: absolute bottom-left on IMAGE (inside overlay) -->
				<span class="cat-badge mag-badge">{article.category.name}</span>
				<h2 class="mag-title" class:mag-title-lg={i === 1}>{article.title}</h2>
				<p class="mag-author">{article.author.name}</p>
			</div>
		</a>
	{/each}
</div>
{/if}

<!-- ══════════════════════════════════════════════════════
	 REMAINING ARTICLES — simple 3-column grid
	 ══════════════════════════════════════════════════════ -->
{#if remaining.length > 0}
<div class="remaining-grid">
	{#each remaining as article}
		{@const url = `/${article.urlPath}`}
		{@const dateStr = formatGermanDate(article.publishedAt)}
		<a href={url} class="rem-card">
			<div class="rem-img">
				{#if article.thumbnail}
					<img src={article.thumbnail} alt={article.title} loading="lazy" />
				{:else}
					<div class="img-ph"></div>
				{/if}
				<span class="cat-badge rem-badge">{article.category.name}</span>
			</div>
			<div class="rem-body">
				<h3 class="rem-title">{article.title}</h3>
				<p class="rem-author">Von {article.author.name} - {dateStr}</p>
			</div>
		</a>
	{/each}
</div>
{/if}

<style>
	/* ── Magazine 5-card grid ──────────────────────────────────
	   Spec: 3 columns, center card spans 2 rows, gap 8px
	   ─────────────────────────────────────────────────────── */
	.magazine-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 280px 280px;   /* top row, bottom row each 280px */
		gap: 8px;
		margin-bottom: 8px;
	}

	/* Each card is a full-bleed image link */
	.mag-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
		/* grid placement supplied via inline style */
	}

	/* Center card (nth 2, index 1): spans both rows = 560px tall */
	.mag-card.tall {
		/* grid-row set inline: 1 / span 2 */
	}

	/* Image fills the entire card */
	.mag-img {
		position: absolute;
		inset: 0;
	}

	.mag-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.mag-card:hover .mag-img img {
		transform: scale(1.04);
	}

	.img-ph {
		width: 100%;
		height: 100%;
		background: #333;
	}

	/* Gradient overlay — spec: linear-gradient(transparent, rgba(0,0,0,0.7)) */
	.mag-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 40px 12px 12px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.70));
		display: flex;
		flex-direction: column;
		gap: 5px;
		z-index: 1;
	}

	/* Category badge — spec: #F7C900 bg, #2D1B69 text, Roboto 11px 700 uppercase */
	.cat-badge {
		display: inline-block;
		background: #F7C900;
		color: #2D1B69;
		font-family: 'Roboto', sans-serif;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 3px 8px;
		border-radius: 2px;
		white-space: nowrap;
		align-self: flex-start;
	}

	/* Title: white, Roboto 700, dark gradient behind */
	.mag-title {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #ffffff;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	/* Center (tall) card gets bigger title */
	.mag-title-lg {
		font-size: 18px;
		-webkit-line-clamp: 4;
	}

	/* Author: small white bold text */
	.mag-author {
		font-family: 'Roboto', sans-serif;
		font-size: 11px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.80);
		margin: 0;
	}

	/* ── Remaining articles: 3-col grid ───────────────────────── */
	.remaining-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.rem-card {
		display: block;
		text-decoration: none;
		background: #fff;
		overflow: hidden;
	}

	.rem-img {
		position: relative;
		padding-bottom: 56.25%;  /* 16:9 */
		overflow: hidden;
		background: #e0e0e0;
	}

	.rem-img img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.35s ease;
	}

	.rem-card:hover .rem-img img {
		transform: scale(1.04);
	}

	/* Badge positioned absolute bottom-left on image */
	.rem-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		z-index: 1;
	}

	.rem-body {
		padding: 10px 2px 2px;
	}

	.rem-title {
		font-family: 'Roboto', sans-serif;
		font-size: 15px;
		font-weight: 700;
		color: #222;
		margin: 0 0 5px;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}

	.rem-card:hover .rem-title { color: #2D1B69; }

	.rem-author {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #555;
		margin: 0;
	}

	/* ── Responsive ─────────────────────────────────────────────── */
	@media (max-width: 900px) {
		.magazine-grid {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto;
		}
		/* Reset inline styles, stack as 2-col on tablet */
		.mag-card {
			grid-column: auto !important;
			grid-row: auto !important;
			height: 220px;
		}
		.remaining-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 600px) {
		.magazine-grid { grid-template-columns: 1fr; }
		.mag-card { height: 200px; }
		.remaining-grid { grid-template-columns: 1fr; }
	}
</style>
