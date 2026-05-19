<script lang="ts">
	import type { Article } from "$lib/types/index.js";
	import ArticleCard from "$lib/components/articles/ArticleCard.svelte";
	import ArticleCardLarge from "$lib/components/articles/ArticleCardLarge.svelte";

	interface Props {
		articles: Article[];
	}

	let { articles }: Props = $props();

	// We expect 5 articles.
	// Index 0: Main (large)
	// Index 1-4: Secondary (small grid)
	let mainArticle = $derived(articles[0]);
	let secondaryArticles = $derived(articles.slice(1, 5));
</script>

{#if mainArticle}
	<section class="exclusive-block" aria-labelledby="exclusive-heading">
		<div class="header-wrap">
			<h2 id="exclusive-heading" class="section-heading">Members only</h2>
			<div class="watermark" aria-hidden="true">EXCLUSIVE</div>
		</div>

		<div class="exclusive-grid">
			<div class="main-col">
				<ArticleCardLarge article={mainArticle} />
			</div>

			<div class="secondary-col">
				{#each secondaryArticles as article}
					<ArticleCard {article} showExcerpt={false} titleSize="sm" />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.exclusive-block {
		margin-bottom: 40px;
		position: relative;
	}

	.header-wrap {
		position: relative;
		margin-bottom: 16px;
		text-align: center;
		padding: 20px 0;
	}

	.section-heading {
		font-family: "Roboto", sans-serif;
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		color: #fff;
		position: relative;
		z-index: 2;
		margin: 0;
		display: inline-block;
		padding: 0 10px;
	}

	.watermark {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: "Roboto", sans-serif;
		font-size: 80px;
		font-weight: 900;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.04);
		z-index: 1;
		white-space: nowrap;
		letter-spacing: 0.05em;
		pointer-events: none;
	}

	.exclusive-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 24px;
	}

	.main-col {
		height: 100%;
		min-height: 400px;
	}

	/* Force the ArticleCard to fill the height */
	.main-col :global(.article-card) {
		height: 100%;
	}

	.secondary-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 900px) {
		.exclusive-grid {
			grid-template-columns: 1fr;
		}
		.main-col {
			min-height: 300px;
		}
	}

	@media (max-width: 599px) {
		.secondary-col {
			grid-template-columns: 1fr;
		}
		.watermark {
			font-size: 40px;
		}
	}
</style>
