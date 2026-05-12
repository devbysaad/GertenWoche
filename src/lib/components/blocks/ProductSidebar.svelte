<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCardSmall from '../articles/ArticleCardSmall.svelte';

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();
</script>

<aside class="product-sidebar">
	<h2 class="section-heading">Produktvorschläge</h2>
	{#each articles.slice(0, 5) as article}
		<ArticleCardSmall {article} showBadge />
	{/each}
	<a href="/category/produktschau" class="sidebar-more">Alle Produkttests →</a>
</aside>

<style>
	.product-sidebar {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 16px;
	}

	.sidebar-more {
		display: block;
		margin-top: 12px;
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}

	.sidebar-more:hover {
		opacity: 0.75;
		color: var(--color-primary);
	}
</style>
