<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCardSmall from '../articles/ArticleCardSmall.svelte';

	interface Props {
		pflanzenschutz: ArticlePreview[];
		produktschau: ArticlePreview[];
		rasen: ArticlePreview[];
	}
	let { pflanzenschutz, produktschau, rasen }: Props = $props();

	const columns = $derived([
		{ title: 'Pflanzenschutz', href: '/category/pflanzenschutz', articles: pflanzenschutz },
		{ title: 'Produktschau', href: '/category/produktschau', articles: produktschau },
		{ title: 'Rasen', href: '/category/rasen', articles: rasen }
	]);
</script>

<section class="three-col-block">
	<div class="three-col-grid">
		{#each columns as col}
			<div class="three-col">
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
	.three-col-block {
		margin-bottom: 32px;
	}

	.three-col-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.three-col {
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
		.three-col-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 599px) {
		.three-col-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
