<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCard from '../articles/ArticleCard.svelte';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	// Live site shows 3 articles per row — use first 3
	const featured = $derived(articles.slice(0, 3));
</script>

<!-- No section heading — matches live site (content flows directly) -->
<section class="featured-section" aria-label="Empfehlungen der Redaktion">
	<div class="featured-grid">
		{#each featured as article}
			<ArticleCard {article} showExcerpt={true} titleSize="md" />
		{/each}
	</div>
</section>

<style>
	.featured-section {
		margin-bottom: 32px;
		padding-top: 8px;
	}

	/* 3 columns — matches live site homepage grid */
	.featured-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;  /* spec: 20px; live site looks ~24px */
		align-items: start;
	}

	@media (max-width: 1023px) {
		.featured-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 599px) {
		.featured-grid {
			grid-template-columns: 1fr;
		}
	}
  </style>
