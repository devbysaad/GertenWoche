<script lang="ts">
	import type { ArticlePreview } from "$lib/types/index.js";
	import { onMount } from "svelte";

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	let current = $state(0);
	let paused = $state(false);
	let timer: ReturnType<typeof setInterval>;

	function next() {
		current = (current + 1) % articles.length;
	}

	function prev() {
		current = (current - 1 + articles.length) % articles.length;
	}

	function goTo(idx: number) {
		current = idx;
	}

	onMount(() => {
		timer = setInterval(() => {
			if (!paused) next();
		}, 5000);
		return () => clearInterval(timer);
	});
</script>

{#if articles.length > 0}
	<section
		class="rotating-carousel"
		onmouseenter={() => (paused = true)}
		onmouseleave={() => (paused = false)}
		aria-label="Artikel-Karussell"
	>
		<div class="carousel-slide">
			{#if articles[current]}
				{@const article = articles[current]}
				<a href={`/${article.urlPath}`} class="slide-link">
					<div class="slide-image">
						{#if article.thumbnail}
							<img
								src={article.thumbnail}
								alt={article.title}
								loading="lazy"
								width="800"
								height="420"
							/>
						{:else}
							<div class="slide-placeholder"></div>
						{/if}
						<div class="slide-overlay"></div>
					</div>
					<div class="slide-content">
						<span class="cat-badge">{article.category.name}</span>
						<h2 class="slide-title">{article.title}</h2>
						<p class="slide-excerpt">{article.excerpt}</p>
					</div>
				</a>

				<!-- Arrows -->
				<button
					class="slide-arrow prev"
					onclick={prev}
					aria-label="Vorheriges"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>
				<button
					class="slide-arrow next"
					onclick={next}
					aria-label="Nächstes"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			{/if}
		</div>

		<!-- Dot indicators -->
		<div class="slide-dots" role="tablist">
			{#each articles as _, idx}
				<button
					class="slide-dot"
					class:active={idx === current}
					onclick={() => goTo(idx)}
					role="tab"
					aria-selected={idx === current}
					aria-label="Artikel {idx + 1}"
				></button>
			{/each}
		</div>
	</section>
{/if}

<style>
	.rotating-carousel {
		margin-bottom: 32px;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
	}

	.carousel-slide {
		position: relative;
	}

	.slide-link {
		display: block;
		position: relative;
		text-decoration: none;
	}

	.slide-image {
		height: 420px;
		position: relative;
		overflow: hidden;
	}

	.slide-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.rotating-carousel:hover .slide-image img {
		transform: scale(1.02);
	}

	.slide-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(
			135deg,
			var(--color-primary) 0%,
			#4a0e4e 100%
		);
	}

	.slide-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.75) 0%,
			rgba(0, 0, 0, 0.1) 60%
		);
	}

	.slide-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 28px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.slide-title {
		font-family: var(--font-heading);
		font-size: 26px;
		font-weight: 800;
		color: #fff;
		margin: 0;
		line-height: 1.25;
		text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.slide-excerpt {
		font-family: var(--font-body);
		font-size: 14px;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Arrows */
	.slide-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 40px;
		height: 40px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(4px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s ease;
	}

	.slide-arrow:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.slide-arrow.prev {
		left: 16px;
	}

	.slide-arrow.next {
		right: 16px;
	}

	/* Dots */
	.slide-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		padding: 12px;
	}

	.slide-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-border);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
	}

	.slide-dot.active {
		background: var(--color-primary);
		width: 24px;
		border-radius: 4px;
	}

	@media (max-width: 767px) {
		.slide-image {
			height: 280px;
		}

		.slide-title {
			font-size: 20px;
		}

		.slide-content {
			padding: 20px;
		}
	}
</style>
