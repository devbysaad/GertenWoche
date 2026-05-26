<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';

	interface Props {
		article: ArticlePreview;
		showExcerpt?: boolean;
		titleSize?: 'sm' | 'md' | 'lg';
		variant?: 'standard' | 'three-col';
	}
	let { article, showExcerpt = false, titleSize = 'md', variant = 'standard' }: Props = $props();

	const url = $derived(`/${article.urlPath}`);
</script>

<article class="article-card" class:three-col-variant={variant === 'three-col'}>
	<!-- Image -->
	<a href={url} class="card-thumb-link" tabindex="-1" aria-hidden="true">
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
			<!-- Category badge overlaid bottom-left — matches live site -->
			<span class="cat-badge card-badge">{article.category.name}</span>
		</div>
	</a>

	<!-- Body: title, author, excerpt -->
	<div class="card-body">
		{#if variant === 'three-col'}
			<h3 class="card-title three-col-title">
				<a href={url}>{article.title}</a>
			</h3>
			{#if showExcerpt && article.excerpt}
				<p class="card-excerpt three-col-excerpt">{article.excerpt}</p>
			{/if}
			<div class="three-col-author">
				{article.author.name}
			</div>
			<div class="three-col-divider"></div>
		{:else}
			<h3 class="card-title size-{titleSize}">
				<a href={url}>{article.title}</a>
			</h3>
			<AuthorMeta author={article.author} publishedAt={article.publishedAt} />
			{#if showExcerpt && article.excerpt}
				<p class="card-excerpt">{article.excerpt}</p>
			{/if}
		{/if}
	</div>
</article>

<style>
	/* No border, no box — clean cards matching live site */
	.article-card {
		background: transparent;
		display: flex;
		flex-direction: column;
		gap: 0;
		transition: opacity 0.15s ease;
	}

	/* ── Thumbnail ── */
	.card-thumb-link {
		display: block;
		overflow: hidden;
		margin-bottom: 10px;
	}

	.card-thumb {
		position: relative;
		padding-bottom: 62%; /* ~16:10 like live site */
		overflow: hidden;
		background: #e0e0e0;
	}

	.card-thumb img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.35s ease;
	}

	.article-card:hover .card-thumb img {
		transform: scale(1.04);
	}

	.thumb-placeholder {
		position: absolute;
		inset: 0;
		background: #ddd;
	}

	/* Category badge — overlaid bottom-left of image */
	.card-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #fff;
		background: rgba(0,0,0,0.55);
		padding: 2px 7px;
		border-radius: 2px;
		z-index: 1;
	}

	/* ── Body ── */
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.card-title {
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		line-height: 1.3;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Size variants */
	.card-title.size-sm { font-size: 14px; }
	.card-title.size-md { font-size: 16px; }  /* spec: Roboto 700 16px */
	.card-title.size-lg { font-size: 19px; }

	.card-title a {
		color: #222;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.card-title a:hover { color: #444; }

	.card-excerpt {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 13px;
		color: #555;
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Hover: spec says box-shadow + translateY */
	.article-card:not(.three-col-variant):hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
		transform: translateY(-2px);
	}

	/* ── Three column variant overrides ── */
	.three-col-title {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: clamp(17px, 1.8vw, 19px);
		font-weight: 500;
		line-height: 1.35;
		margin: 12px 0 10px;
		display: block;
		-webkit-line-clamp: unset;
		overflow: visible;
	}

	.three-col-title a {
		color: #222222;
		transition: color 0.2s ease;
	}

	.three-col-title a:hover {
		color: #006633;
	}

	.three-col-excerpt {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 14px;
		color: #333333;
		line-height: 1.6;
		margin: 0 0 14px;
		display: block;
		-webkit-line-clamp: unset;
		overflow: visible;
	}

	.three-col-author {
		font-family: var(--font-body), sans-serif;
		font-size: 11px;
		font-weight: 700;
		color: #222222;
		margin-bottom: 12px;
	}

	.three-col-divider {
		width: 60%;
		height: 2px;
		background-color: #e0e0e0;
		margin-top: 14px;
		margin-bottom: 4px;
	}
</style>
