<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCardSmall from '$lib/components/articles/ArticleCardSmall.svelte';

	interface Props {
		gartenpraxis: ArticlePreview[];
		wissen: ArticlePreview[];
		europa: ArticlePreview[];
	}
	let { gartenpraxis, wissen, europa }: Props = $props();

	const columns = $derived([
		{ title: 'Gartenpraxis', href: '/category/gartenpraxis', articles: gartenpraxis },
		{ title: 'Wissen', href: '/category/wissen', articles: wissen },
		{ title: 'Europa', href: '/category/aktuelles/europa', articles: europa }
	]);
</script>

<section class="mixed-block">
	<div class="mixed-grid">
		{#each columns as col}
			<div class="mixed-col">
				<div class="col-header">
					<h2 class="section-heading">{col.title}</h2>
					<a href={col.href} class="col-more">Mehr →</a>
				</div>
				{#each col.articles.slice(0, 4) as article}
					<ArticleCardSmall {article} showBadge={false} />
				{/each}
			</div>
		{/each}
	</div>
</section>

<style>
	.mixed-block {
		margin-bottom: 32px;
	}

	.mixed-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.mixed-col {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 16px;
	}

	.col-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.col-more {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}

	.col-more:hover {
		opacity: 0.75;
		color: var(--color-primary);
	}

	@media (max-width: 1023px) {
		.mixed-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 599px) {
		.mixed-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
