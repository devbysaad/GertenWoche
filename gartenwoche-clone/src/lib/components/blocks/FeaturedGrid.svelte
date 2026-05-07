<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	const featured = $derived(articles.slice(0, 4));
</script>

<section class="featured-section">
	<h2 class="section-heading">Empfehlungen der Redaktion</h2>
	<div class="featured-grid">
		{#each featured as article}
			<ArticleCard {article} />
		{/each}
	</div>
</section>

<style>
	.featured-section {
		margin-bottom: 32px;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gap);
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
