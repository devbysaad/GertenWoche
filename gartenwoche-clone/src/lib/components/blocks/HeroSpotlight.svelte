<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';

	interface Props {
		article: ArticlePreview;
	}
	let { article }: Props = $props();

	const url = $derived(`/${article.urlPath}`);

</script>

<section class="hero-spotlight">
	<a href={url} class="hero-link">
		<div class="hero-image">
			{#if article.thumbnail}
				<img
					src={article.thumbnail}
					alt={article.title}
					loading="eager"
					width="1200"
					height="500"
				/>
			{:else}
				<div class="hero-placeholder"></div>
			{/if}
			<div class="hero-overlay"></div>
		</div>

		<div class="hero-content">
			<span class="cat-badge hero-badge">{article.category.name}</span>
			<h1 class="hero-title">{article.title}</h1>
			<p class="hero-excerpt">{article.excerpt}</p>
			<AuthorMeta author={article.author} publishedAt={article.publishedAt} light noLink />
		</div>
	</a>
</section>

<style>
	.hero-spotlight {
		width: 100%;
		margin-bottom: 32px;
	}

	.hero-link {
		display: block;
		position: relative;
		border-radius: var(--radius-md);
		overflow: hidden;
		min-height: 400px;
		text-decoration: none;
	}

	.hero-link:hover .hero-title {
		text-decoration: underline;
		text-decoration-color: var(--color-accent);
	}

	.hero-image {
		width: 100%;
		height: 500px;
		position: relative;
	}

	.hero-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--color-primary) 0%, #4a0e4e 100%);
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.82) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
	}

	.hero-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.hero-badge {
		align-self: flex-start;
	}

	.hero-title {
		font-family: var(--font-heading);
		font-size: clamp(26px, 4vw, 38px);
		font-weight: 900;
		color: #fff;
		line-height: 1.2;
		margin: 0;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}

	.hero-excerpt {
		font-family: var(--font-body);
		font-size: 15px;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		max-width: 700px;
	}

	@media (max-width: 767px) {
		.hero-image {
			height: 320px;
		}

		.hero-content {
			padding: 20px;
		}
	}
</style>
