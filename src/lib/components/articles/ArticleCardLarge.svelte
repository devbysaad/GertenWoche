<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';

	interface Props {
		article: ArticlePreview;
	}
	let { article }: Props = $props();

	const url = $derived(`/${article.urlPath}`);

	const excerpt = $derived(
		article.excerpt.length > 130 ? article.excerpt.slice(0, 127) + '…' : article.excerpt
	);
</script>

<article class="card-large card-hover">
	<a href={url} class="card-thumb-link">
		<div class="card-thumb">
			{#if article.thumbnail}
				<img src={article.thumbnail} alt={article.title} loading="lazy" width="800" height="480" />
			{:else}
				<div class="thumb-placeholder"></div>
			{/if}
		</div>
	</a>

	<div class="card-body">
		<CategoryBadge category={article.category} />
		<h2 class="card-title">
			<a href={url}>{article.title}</a>
		</h2>
		<p class="card-excerpt">{excerpt}</p>
		<AuthorMeta author={article.author} publishedAt={article.publishedAt} />
	</div>
</article>

<style>
	.card-large {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.card-thumb-link {
		display: block;
	}

	.card-thumb {
		position: relative;
		padding-bottom: 62%;
		overflow: hidden;
		background: var(--color-border);
	}

	.card-thumb img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.card-large:hover .card-thumb img {
		transform: scale(1.03);
	}

	.thumb-placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #e0e0e0 0%, #ececec 100%);
	}

	.card-body {
		padding: 16px 18px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: 22px;
		font-weight: 800;
		line-height: 1.25;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-title a {
		color: var(--color-text);
		transition: color 0.2s ease;
	}

	.card-title a:hover {
		color: var(--color-primary);
	}

	.card-excerpt {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
