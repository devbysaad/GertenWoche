<script lang="ts">
	import type { ArticlePreview } from "$lib/types/index.js";
	import { formatGermanDate } from "$lib/utils/date.js";

	interface Props {
		articles: ArticlePreview[];
		skipFeatured?: boolean;
	}
	let { articles, skipFeatured = false }: Props = $props();

	const featured = $derived(articles.slice(0, 5));
	const remaining = $derived(articles.slice(5));
</script>

{#if !skipFeatured && featured.length > 0}
	<div class="magazine-grid">
		{#each featured as article, i}
			{@const url = `/${article.urlPath}`}
			{@const col = [1, 2, 3, 1, 3][i]}
			{@const row = i === 1 ? "1 / span 2" : i < 3 ? "1" : "2"}
			<a
				href={url}
				class="mag-card"
				style="grid-column:{col};grid-row:{row}"
			>
				{#if article.thumbnail}
					<img
						src={article.thumbnail}
						alt={article.title}
						loading={i === 0 ? "eager" : "lazy"}
						class="mag-img"
					/>
				{:else}
					<div class="mag-img mag-img-ph"></div>
				{/if}
				<div class="mag-gradient"></div>
				<span class="mag-badge">{article.category.name}</span>
				<p class="mag-title" class:mag-title-lg={i === 1}>
					{article.title}
				</p>
				<p class="mag-author">{article.author.name}</p>
			</a>
		{/each}
	</div>
{/if}

{#if remaining.length > 0}
	<div class="remaining-grid">
		{#each remaining as article}
			{@const url = `/${article.urlPath}`}
			<a href={url} class="rem-card">
				<div class="rem-img">
					{#if article.thumbnail}
						<img
							src={article.thumbnail}
							alt={article.title}
							loading="lazy"
						/>
					{:else}
						<div class="rem-img-ph"></div>
					{/if}
					<span class="rem-badge">{article.category.name}</span>
				</div>
				<div class="rem-body">
					<p class="rem-title">{article.title}</p>
					<p class="rem-meta">Von {article.author.name}</p>
				</div>
			</a>
		{/each}
	</div>
{/if}

<style>
	/* ═══════════════════════════════════════════════════════
	   MAGAZINE GRID — spec-exact
	   3 cols × 2 rows, center spans both rows, gap 3px
	   ═══════════════════════════════════════════════════════ */
	.magazine-grid {
		display: grid;
		grid-template-columns: 1fr 1.3fr 1fr;
		grid-template-rows: 200px 200px;
		gap: 3px;
		margin-bottom: 24px;
	}

	/* Card: image is the card — position relative so absolute children work */
	.mag-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #1a1a1a;
	}

	/* Full-bleed image — NO border-radius */
	.mag-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 0;
		transition: transform 0.4s ease;
	}
	.mag-card:hover .mag-img {
		transform: scale(1.04);
	}

	.mag-img-ph {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			#2a2a2a 25%,
			#3d3d3d 50%,
			#2a2a2a 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.6s infinite;
	}

	/* Dark gradient: covers bottom 50% */
	.mag-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.72) 100%);
		pointer-events: none;
	}

	/* Badge: absolute, bottom 8px left 8px */
	.mag-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		z-index: 2;
		display: inline-block;
		background: rgba(0, 0, 0, 0.65);
		color: #ffffff;
		font-family: "Roboto", sans-serif;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 6px;
		border-radius: 2px;
		white-space: nowrap;
	}

	/* Title: sits above badge (bottom 30px to clear badge) */
	.mag-title {
		position: absolute;
		bottom: 30px;
		left: 8px;
		right: 8px;
		z-index: 2;
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: #ffffff;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
	}
	.mag-title-lg {
		font-size: 17px;
	}

	/* Author: visible below badge on center card */
	.mag-author {
		position: absolute;
		bottom: 26px;
		left: 8px;
		z-index: 3;
		font-family: "Open Sans", sans-serif;
		font-size: 10px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		white-space: nowrap;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
		display: none;
	}
	/* Show author only on the center (tall) card */
	.mag-card:nth-child(2) .mag-author {
		display: block;
	}

	/* ═══════════════════════════════════════════════════════
	   REMAINING: 2-column, gap 20px, white bg cards
	   ═══════════════════════════════════════════════════════ */
	.remaining-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}

	/* Card: white bg, no shadow by default */
	.rem-card {
		display: block;
		text-decoration: none;
		background: #fff;
		overflow: hidden;
		transition: box-shadow 0.2s ease;
	}
	.rem-card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	/* Image: 16:9 ratio */
	.rem-img {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 */
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

	.rem-img-ph {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			#e0e0e0 25%,
			#ececec 50%,
			#e0e0e0 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.6s infinite;
	}

	/* Badge: bottom-left of image */
	.rem-badge {
		position: absolute;
		bottom: 6px;
		left: 6px;
		z-index: 1;
		display: inline-block;
		background: rgba(0, 0, 0, 0.65);
		color: #ffffff;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 6px;
		border-radius: 2px;
		white-space: nowrap;
	}

	.rem-body {
		padding: 10px 8px 12px;
	}

	/* Title: Roboto 15px 700 */
	.rem-title {
		font-family: "Roboto", sans-serif;
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
	.rem-card:hover .rem-title {
		color: #222;
	}

	/* "Von Author · Date": Open Sans 12px #555 */
	.rem-meta {
		font-family: "Open Sans", sans-serif;
		font-size: 12px;
		color: #555;
		margin: 0;
	}

	/* ── Skeleton shimmer ───────────────────────────────────── */
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
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
		.remaining-grid {
			gap: 12px;
		}
	}

	@media (max-width: 600px) {
		.magazine-grid {
			grid-template-columns: 1fr;
		}
		.mag-card {
			height: 180px;
		}
		.remaining-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
