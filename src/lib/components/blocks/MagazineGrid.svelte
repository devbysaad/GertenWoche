<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import { formatGermanDate } from '$lib/utils/date.js';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	const featured  = $derived(articles.slice(0, 5));
	const remaining = $derived(articles.slice(5));
</script>

<!-- ══════════════════════════════════════════════════════
     MAGAZINE GRID — 5 cards
     [1] [  2  ] [3]
     [4] [  2  ] [5]   ← center spans both rows
     ══════════════════════════════════════════════════════ -->
{#if featured.length > 0}
<div class="magazine-grid">
	{#each featured as article, i}
		{@const url = `/${article.urlPath}`}
		<a
			href={url}
			class="mag-card"
			class:tall={i === 1}
			style="grid-column:{[1,2,3,1,3][i]};grid-row:{i===1?'1/span 2':i<3?'1':'2'}"
			tabindex="0"
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
				<span class="cat-badge mag-badge">{article.category.name}</span>
				<p class="mag-title" class:mag-title-lg={i === 1}>{article.title}</p>
				<p class="mag-author">{article.author.name}</p>
			</div>
		</a>
	{/each}
</div>
{/if}

<!-- ══════════════════════════════════════════════════════
     REMAINING — 2-column grid (matches screenshot)
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
				<!-- Badge: top-left corner of image, matches screenshot -->
				<span class="cat-badge rem-badge">{article.category.name}</span>
			</div>
			<div class="rem-body">
				<p class="rem-title">{article.title}</p>
				<p class="rem-author">{article.author.name}</p>
			</div>
		</a>
	{/each}
</div>
{/if}

<style>
	/* ── Magazine 5-card grid ──────────────────────────────────
	   3 cols, center spans 2 rows, gap ~3px (thin divider lines
	   matching the screenshot)
	   ─────────────────────────────────────────────────────── */
	.magazine-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 280px 280px;
		gap: 3px;         /* thin dividing lines like screenshot */
		margin-bottom: 3px;
	}

	.mag-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #1a1a1a;
	}

	/* Image fills the entire card absolutely */
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
	.mag-card:hover .mag-img img { transform: scale(1.04); }

	.img-ph { width: 100%; height: 100%; background: #444; }

	/* Gradient + text overlay — bottom of each card */
	.mag-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 48px 10px 10px;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
		display: flex;
		flex-direction: column;
		gap: 4px;
		z-index: 1;
	}

	/* Category badge: #F7C900 bg, #2D1B69 text, 11px 700 uppercase */
	.cat-badge {
		display: inline-block;
		background: #F7C900;
		color: #2D1B69;
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 6px;
		border-radius: 2px;
		white-space: nowrap;
		align-self: flex-start;
	}

	.mag-badge {
		/* sits inside the overlay just above the title */
	}

	/* Title: white, Roboto 700 */
	.mag-title {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: #ffffff;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-shadow: 0 1px 3px rgba(0,0,0,0.5);
	}
	.mag-title-lg {
		font-size: 17px;
		-webkit-line-clamp: 4;
	}

	/* Author: small white bold */
	.mag-author {
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		color: rgba(255,255,255,0.75);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	/* ── Remaining: 2-column grid (matches screenshot) ───────── */
	.remaining-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3px;     /* same thin gap as magazine grid */
	}

	.rem-card {
		display: block;
		text-decoration: none;
		background: #fff;
		overflow: hidden;
	}

	.rem-img {
		position: relative;
		padding-bottom: 66%;    /* 3:2 ratio — matches screenshot proportions */
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
	.rem-card:hover .rem-img img { transform: scale(1.04); }

	/* Badge: TOP-LEFT corner of image (matches screenshot) */
	.rem-badge {
		position: absolute;
		top: 6px;
		left: 6px;
		z-index: 1;
	}

	.rem-body {
		padding: 8px 6px 10px;
	}

	.rem-title {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #222;
		margin: 0 0 4px;
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
		font-size: 11px;
		color: #777;
		margin: 0;
		font-style: italic;
	}

	/* ── Responsive ─────────────────────────────────────────── */
	@media (max-width: 900px) {
		.magazine-grid {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto;
		}
		.mag-card {
			grid-column: auto !important;
			grid-row: auto !important;
			height: 200px;
		}
	}

	@media (max-width: 600px) {
		.magazine-grid { grid-template-columns: 1fr; }
		.mag-card { height: 180px; }
		.remaining-grid { grid-template-columns: 1fr; }
	}
</style>
