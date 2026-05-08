<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import ArticleCard from './ArticleCard.svelte';

	interface Props {
		articles: ArticlePreview[];
		title?: string;
		linkAll?: string;
	}
	let { articles, title, linkAll }: Props = $props();

	let trackEl = $state<HTMLDivElement | null>(null);

	function scrollBy(dir: number) {
		if (!trackEl) return;
		const cardWidth = 296 + 16; // min-width + gap
		trackEl.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
	}
</script>

<section class="carousel-section">
	{#if title}
		<div class="carousel-header">
			<h2 class="section-heading">{title}</h2>
			{#if linkAll}
				<a href={linkAll} class="carousel-all">Mehr Artikel →</a>
			{/if}
		</div>
	{/if}

	<div class="carousel-wrap">
		<button
			class="carousel-arrow prev"
			onclick={() => scrollBy(-1)}
			aria-label="Vorherige Artikel"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>

		<div class="carousel-track" bind:this={trackEl}>
			{#each articles as article}
				<div class="carousel-item">
					<ArticleCard {article} />
				</div>
			{/each}
		</div>

		<button
			class="carousel-arrow next"
			onclick={() => scrollBy(1)}
			aria-label="Nächste Artikel"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</button>
	</div>
</section>

<style>
	.carousel-section {
		width: 100%;
	}

	.carousel-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.carousel-all {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}

	.carousel-all:hover {
		opacity: 0.75;
		color: var(--color-primary);
	}

	.carousel-wrap {
		position: relative;
	}

	.carousel-track {
		display: flex;
		gap: 16px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding-bottom: 4px;
	}

	.carousel-track::-webkit-scrollbar {
		display: none;
	}

	.carousel-item {
		min-width: 280px;
		max-width: 280px;
		flex-shrink: 0;
		scroll-snap-align: start;
	}

	.carousel-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 36px;
		height: 36px;
		background: var(--color-primary);
		color: #fff;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: background 0.2s ease;
	}

	.carousel-arrow:hover {
		background: var(--color-primary-hover);
	}

	.carousel-arrow.prev {
		left: -18px;
	}

	.carousel-arrow.next {
		right: -18px;
	}

	@media (max-width: 767px) {
		.carousel-arrow {
			display: none;
		}
	}
</style>
