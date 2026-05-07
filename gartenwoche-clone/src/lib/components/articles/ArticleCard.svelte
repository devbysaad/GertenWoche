<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';

	interface Props {
		article: ArticlePreview;
	}
	let { article }: Props = $props();

	// Use urlPath extracted from post.link — handles 2 and 3 level paths correctly
	const url = $derived(`/${article.urlPath}`);
</script>


<article class="article-card card-hover">
	<a href={url} class="card-link" tabindex="-1" aria-hidden="true">
		<div class="card-thumb">
			{#if article.thumbnail}
				<img
					src={article.thumbnail}
					alt={article.title}
					loading="lazy"
					width="400"
					height="225"
				/>
			{:else}
				<div class="thumb-placeholder"></div>
			{/if}
		</div>
	</a>

	<div class="card-body">
		<CategoryBadge category={article.category} />
		<h3 class="card-title">
			<a href={url}>{article.title}</a>
		</h3>
		<AuthorMeta author={article.author} publishedAt={article.publishedAt} />
	</div>
</article>

<style>
	.article-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.card-link {
		display: block;
	}

	.card-thumb {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 */
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

	.article-card:hover .card-thumb img {
		transform: scale(1.03);
	}

	.thumb-placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #e0e0e0 0%, #ececec 100%);
	}

	.card-body {
		padding: 12px 14px 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		line-height: 1.3;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
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
</style>
