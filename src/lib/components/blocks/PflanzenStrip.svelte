<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCarousel from '../articles/ArticleCarousel.svelte';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();
</script>

<section class="pflanzen-strip">
	<ArticleCarousel
		{articles}
		title="Pflanzenempfehlungen"
		linkAll="/category/pflanzen/pflanzenempfehlungen"
	/>
</section>

<style>
	.pflanzen-strip {
		margin-bottom: 32px;
		padding: 24px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}
</style>
