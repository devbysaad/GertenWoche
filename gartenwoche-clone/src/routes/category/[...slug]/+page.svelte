<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';
	import ArticleCardSmall from '$lib/components/articles/ArticleCardSmall.svelte';

	let { data } = $props();
	const { category, articles, weitereArtikel, subCategories } = $derived(data);

	// Featured block: first article large, next 2 small on the right
	const featuredLarge = $derived(articles[0]);
	const featuredSmall = $derived(articles.slice(1, 3));
	// Remaining articles in the grid (below the featured block)
	const gridArticles = $derived(articles.slice(3));

	const crumbs = $derived([
		{ label: category.name }
	]);
</script>

<svelte:head>
	<title>{category.name} | Gartenwoche</title>
	<meta name="description" content="Aktuelle Artikel aus der Kategorie {category.name} auf Gartenwoche." />
</svelte:head>

<div class="category-page">
	<div class="container">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="category-heading">{category.name}</h1>

		{#if articles.length === 0}
			<p class="no-articles">Keine Artikel in dieser Kategorie.</p>
		{:else}
			<!-- ── Featured block (1 large + 2 small) ── -->
			{#if featuredLarge}
				<div class="featured-block">
					<!-- Large card left -->
					<a href="/{featuredLarge.urlPath}" class="featured-large">
						<div class="feat-thumb">
							{#if featuredLarge.thumbnail}
								<img src={featuredLarge.thumbnail} alt={featuredLarge.title} loading="eager" />
							{:else}
								<div class="thumb-placeholder"></div>
							{/if}
							<div class="feat-overlay">
								<CategoryBadge category={featuredLarge.category} />
								<h2 class="feat-title">{featuredLarge.title}</h2>
								<AuthorMeta author={featuredLarge.author} publishedAt={featuredLarge.publishedAt} />
							</div>
						</div>
					</a>

					<!-- 2 small cards right -->
					<div class="featured-small-stack">
						{#each featuredSmall as art}
							<a href="/{art.urlPath}" class="feat-small-item">
								<div class="feat-small-thumb">
									{#if art.thumbnail}
										<img src={art.thumbnail} alt={art.title} loading="lazy" />
									{:else}
										<div class="thumb-placeholder"></div>
									{/if}
									<div class="feat-small-overlay">
										<CategoryBadge category={art.category} />
										<p class="feat-small-title">{art.title}</p>
										<AuthorMeta author={art.author} publishedAt={art.publishedAt} />
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- ── Main grid + Sidebar ── -->
			<div class="main-layout">
				<!-- Article grid -->
				<section class="article-section">
					{#if gridArticles.length > 0}
						<div class="article-grid">
							{#each gridArticles as art}
								<ArticleCard article={art} />
							{/each}
						</div>
					{/if}

					<!-- Subcategory links -->
					{#if subCategories.length > 0}
						<div class="subcats">
							{#each subCategories as sub}
								<a href="/category/{category.slug}/{sub.slug}" class="subcat-link">
									{sub.name}
									<span class="subcat-count">({sub.count})</span>
								</a>
							{/each}
						</div>
					{/if}
				</section>

				<!-- Weitere Artikel sidebar -->
				{#if weitereArtikel.length > 0}
					<aside class="weitere-sidebar">
						<h3 class="sidebar-heading">Weitere Artikel</h3>
						<ul class="weitere-list">
							{#each weitereArtikel as art}
								<li class="weitere-item">
									<a href="/{art.urlPath}" class="weitere-link">
										{#if art.thumbnail}
											<img src={art.thumbnail} alt={art.title} loading="lazy" class="weitere-thumb" />
										{/if}
										<div class="weitere-body">
											<CategoryBadge category={art.category} />
											<p class="weitere-title">{art.title}</p>
											<span class="weitere-more">Keine Kommentare</span>
										</div>
									</a>
								</li>
							{/each}
						</ul>
					</aside>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.category-page {
		padding: 24px 0 48px;
		background: var(--color-bg);
	}

	.category-heading {
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-text);
		margin: 0 0 20px;
		letter-spacing: 0.02em;
	}

	.no-articles {
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* ── Featured Block ── */
	.featured-block {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 4px;
		margin-bottom: 24px;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.featured-large {
		display: block;
		position: relative;
		text-decoration: none;
	}

	.feat-thumb {
		position: relative;
		height: 320px;
		overflow: hidden;
	}

	.feat-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.featured-large:hover .feat-thumb img {
		transform: scale(1.04);
	}

	.thumb-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #c8d8b0 0%, #a0b878 100%);
	}

	.feat-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 16px 20px;
		background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.feat-title {
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 800;
		color: #fff;
		line-height: 1.3;
		margin: 0;
		text-shadow: 0 1px 3px rgba(0,0,0,0.5);
	}

	/* Small stack */
	.featured-small-stack {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 4px;
	}

	.feat-small-item {
		display: block;
		text-decoration: none;
		position: relative;
	}

	.feat-small-thumb {
		position: relative;
		height: 158px;
		overflow: hidden;
	}

	.feat-small-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.feat-small-item:hover .feat-small-thumb img {
		transform: scale(1.04);
	}

	.feat-small-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 14px;
		background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.feat-small-title {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: #fff;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ── Main 70/30 layout ── */
	.main-layout {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 24px;
		align-items: start;
	}

	/* Article grid — 2 columns */
	.article-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}

	.subcats {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}

	.subcat-link {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-primary);
		background: var(--color-tag-bg);
		border: 1px solid var(--color-border);
		padding: 6px 14px;
		border-radius: 20px;
		transition: all 0.2s;
	}

	.subcat-link:hover {
		background: var(--color-primary);
		color: #fff;
	}

	.subcat-count {
		color: var(--color-text-faint);
		font-size: 11px;
	}

	/* ── Weitere Artikel sidebar ── */
	.weitere-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.sidebar-heading {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		padding: 12px 16px 10px;
		border-bottom: 1px solid var(--color-border);
		margin: 0;
	}

	.weitere-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.weitere-item {
		border-bottom: 1px solid var(--color-border);
	}

	.weitere-item:last-child {
		border-bottom: none;
	}

	.weitere-link {
		display: flex;
		gap: 10px;
		padding: 10px 14px;
		text-decoration: none;
		transition: background 0.2s;
	}

	.weitere-link:hover {
		background: var(--color-bg);
	}

	.weitere-thumb {
		width: 64px;
		height: 48px;
		object-fit: cover;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.weitere-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.weitere-title {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-text);
		line-height: 1.35;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.weitere-more {
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--color-text-faint);
	}

	/* Responsive */
	@media (max-width: 1023px) {
		.main-layout {
			grid-template-columns: 1fr;
		}
		.weitere-sidebar {
			position: static;
		}
	}

	@media (max-width: 767px) {
		.featured-block {
			grid-template-columns: 1fr;
		}
		.featured-small-stack {
			grid-template-rows: auto;
			grid-template-columns: 1fr 1fr;
		}
		.article-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
