<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import { formatGermanDate } from '$lib/utils/date.js';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();
</script>

<aside class="weitere-sidebar" aria-label="Weitere Artikel">
	<h2 class="sidebar-heading">Weitere Artikel</h2>

	<ul class="sidebar-list">
		{#each articles.slice(0, 5) as article, i}
			{@const url = `/${article.urlPath}`}
			{@const dateStr = formatGermanDate(article.publishedAt)}
			<li class="sidebar-card" class:last={i === 4}>
				<a href={url} class="sidebar-link">
					<!-- Thumbnail: 70×55px float left -->
					<div class="sidebar-thumb">
						{#if article.thumbnail}
							<img src={article.thumbnail} alt={article.title} loading="lazy" />
						{:else}
							<div class="thumb-ph"></div>
						{/if}
					</div>
					<!-- Text -->
					<div class="sidebar-text">
						<p class="sidebar-title">{article.title}</p>
						<p class="sidebar-meta">{article.author.name}</p>
						<p class="sidebar-meta">{dateStr}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</aside>

<style>
	/* ── Wrapper ─────────────────────────────────────────────── */
	.weitere-sidebar {
		min-width: 0;
	}

	/* ── Heading — spec: Roboto 16px 700, yellow 3px border-bottom ── */
	.sidebar-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #222222;
		margin: 0 0 12px;
		padding-bottom: 8px;
		border-bottom: 3px solid #F7C900;
	}

	/* ── List ────────────────────────────────────────────────── */
	.sidebar-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* ── Card — spec: border-bottom 1px #E0E0E0 except last, padding 10px 0 ── */
	.sidebar-card {
		border-bottom: 1px solid #E0E0E0;
		padding: 10px 0;
	}
	.sidebar-card.last {
		border-bottom: none;
	}

	.sidebar-link {
		display: flex;
		gap: 10px;
		text-decoration: none;
		align-items: flex-start;
	}

	/* ── Thumbnail: 70×55px, object-cover, border-radius 2px ── */
	.sidebar-thumb {
		width: 70px;
		height: 55px;
		flex-shrink: 0;
		border-radius: 2px;
		overflow: hidden;
		background: #e0e0e0;
	}

	.sidebar-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 2px;
	}

	.thumb-ph {
		width: 100%;
		height: 100%;
		background: #e0e0e0;
	}

	/* ── Text ─────────────────────────────────────────────────── */
	.sidebar-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* Title: Roboto 13px 700, 2-line clamp, hover #2D1B69 */
	.sidebar-title {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: #222222;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s ease;
	}

	.sidebar-link:hover .sidebar-title {
		color: #2D1B69;
	}

	/* Author + Date: Open Sans 11px, #555 */
	.sidebar-meta {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #555555;
		margin: 0;
	}
</style>
