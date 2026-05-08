<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import { formatGermanShort } from '$lib/utils/date.js';

	interface Props {
		article: ArticlePreview;
		showBadge?: boolean;
	}
	let { article, showBadge = false }: Props = $props();

	const url = $derived(`/${article.urlPath}`);

</script>

<article class="card-small">
	{#if article.thumbnail}
		<a href={url} class="small-thumb" tabindex="-1" aria-hidden="true">
			<img
				src={article.thumbnail}
				alt={article.title}
				loading="lazy"
				width="80"
				height="80"
			/>
		</a>
	{:else}
		<a href={url} class="small-thumb thumb-placeholder" tabindex="-1" aria-hidden="true"></a>
	{/if}

	<div class="small-body">
		{#if showBadge}
			<span class="cat-badge small-badge">{article.category.name}</span>
		{/if}
		<h4 class="small-title">
			<a href={url}>{article.title}</a>
		</h4>
		<time class="small-date" datetime={article.publishedAt instanceof Date ? article.publishedAt.toISOString() : article.publishedAt}>
			{formatGermanShort(article.publishedAt)}
		</time>
	</div>
</article>

<style>
	.card-small {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-border);
	}

	.card-small:last-child {
		border-bottom: none;
	}

	.small-thumb {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		border-radius: var(--radius-sm);
		overflow: hidden;
		display: block;
	}

	.small-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s ease;
	}

	.card-small:hover .small-thumb img {
		transform: scale(1.05);
	}

	.thumb-placeholder {
		background: linear-gradient(135deg, #e0e0e0 0%, #ececec 100%);
	}

	.small-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.small-badge {
		font-size: 9px;
		padding: 2px 6px;
	}

	.small-title {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		line-height: 1.3;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.small-title a {
		color: var(--color-text);
		transition: color 0.2s ease;
	}

	.small-title a:hover {
		color: var(--color-primary);
	}

	.small-date {
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--color-text-faint);
	}
</style>
