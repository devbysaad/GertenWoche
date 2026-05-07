<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCardLarge from '$lib/components/articles/ArticleCardLarge.svelte';
	import ArticleCardSmall from '$lib/components/articles/ArticleCardSmall.svelte';

	interface Props {
		main: ArticlePreview;
		secondary: ArticlePreview[];
	}
	let { main, secondary }: Props = $props();
</script>

<section class="rasen-block">
	<div class="rasen-inner">
		<div class="rasen-main">
			<ArticleCardLarge article={main} />
		</div>
		<div class="rasen-sidebar">
			<h2 class="section-heading">Rasen & Garten</h2>
			{#each secondary.slice(0, 4) as article}
				<ArticleCardSmall {article} showBadge />
			{/each}
		</div>
	</div>
</section>

<style>
	.rasen-block {
		margin-bottom: 32px;
	}

	.rasen-inner {
		display: grid;
		grid-template-columns: 60fr 40fr;
		gap: var(--gap);
		align-items: start;
	}

	.rasen-sidebar {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 16px;
	}

	@media (max-width: 767px) {
		.rasen-inner {
			grid-template-columns: 1fr;
		}
	}
</style>
