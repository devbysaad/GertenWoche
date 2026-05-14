<script lang="ts">
	import type { ArticlePreview } from "$lib/types/index.js";

	interface Props {
		gartenpraxis: ArticlePreview[];
		wissen: ArticlePreview[];
		europa: ArticlePreview[];
	}
	let { gartenpraxis, wissen, europa }: Props = $props();

	const columns = $derived([
		{ title: "Gartenpraxis", href: "/category/gartenpraxis/", articles: gartenpraxis },
		{ title: "Wissen",       href: "/category/wissen/",       articles: wissen },
		{ title: "Europa",       href: "/category/aktuelles/europa/", articles: europa },
	]);

	// Per-column current index
	let indices = $state([0, 0, 0]);

	function prev(col: number) {
		const len = columns[col].articles.length;
		if (len === 0) return;
		indices[col] = (indices[col] - 1 + len) % len;
	}
	function next(col: number) {
		const len = columns[col].articles.length;
		if (len === 0) return;
		indices[col] = (indices[col] + 1) % len;
	}
</script>

<section class="mixed-block" aria-label="Themenbereiche">
	<div class="mixed-grid">
		{#each columns as col, ci}
			{@const art = col.articles[indices[ci]]}
			<div class="mixed-col">
				{#if art}
					{@const url = `/${art.urlPath}`}
					<!-- Featured image -->
					<a href={url} class="mc-img-link">
						{#if art.thumbnail}
							<img src={art.thumbnail} alt={art.title} loading="lazy" class="mc-img" />
						{:else}
							<div class="mc-img-ph"></div>
						{/if}
					</a>

					<!-- Content -->
					<div class="mc-body">
						<span class="mc-cat">{art.category.name}</span>
						<h3 class="mc-title">
							<a href={url}>{art.title}</a>
						</h3>
						{#if art.excerpt}
							<p class="mc-excerpt">{art.excerpt}</p>
						{/if}
						<span class="mc-author">{art.author.name}</span>
					</div>

					<!-- Navigation arrows -->
					{#if col.articles.length > 1}
						<div class="mc-nav">
							<button class="mc-arrow" onclick={() => prev(ci)} aria-label="Vorheriger Artikel">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
									<polyline points="15 18 9 12 15 6"/>
								</svg>
							</button>
							<div class="mc-dots">
								{#each col.articles as _, di}
									<span class="mc-dot" class:active={di === indices[ci]}></span>
								{/each}
							</div>
							<button class="mc-arrow" onclick={() => next(ci)} aria-label="Nächster Artikel">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
									<polyline points="9 18 15 12 9 6"/>
								</svg>
							</button>
						</div>
					{/if}
				{:else}
					<div class="mc-empty">Keine Artikel</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.mixed-block {
		margin-bottom: 32px;
	}

	/* 3-col equal grid */
	.mixed-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.mixed-col {
		display: flex;
		flex-direction: column;
		background: #fff;
		border: 1px solid #E0E0E0;
		overflow: hidden;
	}

	/* ── Image ── */
	.mc-img-link {
		display: block;
		overflow: hidden;
		flex-shrink: 0;
		height: 190px;
		background: #e0e0e0;
	}
	.mc-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.35s ease;
	}
	.mc-img-link:hover .mc-img { transform: scale(1.04); }
	.mc-img-ph {
		width: 100%;
		height: 100%;
		background: #e8e8e8;
	}

	/* ── Body ── */
	.mc-body {
		padding: 14px 16px 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	.mc-cat {
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #5a9e3a;   /* green for category label — like reference */
	}

	.mc-title {
		font-family: 'Roboto', sans-serif;
		font-size: 15px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.mc-title a {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s;
	}
	.mc-title a:hover { color: #444; }

	.mc-excerpt {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		line-height: 1.55;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.mc-author {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #999;
		margin-top: auto;
		padding-top: 4px;
	}

	/* ── Navigation ── */
	.mc-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		border-top: 1px solid #F0F0F0;
	}

	.mc-arrow {
		background: none;
		border: 1px solid #ddd;
		border-radius: 2px;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #666;
		transition: border-color 0.15s, color 0.15s;
		padding: 0;
	}
	.mc-arrow:hover {
		border-color: #999;
		color: #222;
	}

	.mc-dots {
		display: flex;
		gap: 5px;
		align-items: center;
	}
	.mc-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #D0D0D0;
		transition: background 0.2s;
	}
	.mc-dot.active { background: #5a9e3a; }

	.mc-empty {
		padding: 24px;
		color: #999;
		font-size: 13px;
		text-align: center;
	}

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.mixed-grid { grid-template-columns: 1fr 1fr; }
	}
	@media (max-width: 560px) {
		.mixed-grid { grid-template-columns: 1fr; }
		.mc-img-link { height: 200px; }
	}
</style>
