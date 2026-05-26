<script lang="ts">
	import Breadcrumb from "$lib/components/layout/Breadcrumb.svelte";
	import MagazineGrid from "$lib/components/blocks/MagazineGrid.svelte";
	import WeitereArtikelSidebar from "$lib/components/blocks/WeitereArtikelSidebar.svelte";
	import Pagination from "$lib/components/ui/Pagination.svelte";
	import AdBanner from "$lib/components/ui/AdBanner.svelte";
	import HeroSpotlight from "$lib/components/blocks/HeroSpotlight.svelte";

	let { data } = $props();
	const { category, articles, weitereArtikel, subCategories, pagination } =
		$derived(data);

	const crumbs = $derived([{ label: category.name }]);
</script>

<svelte:head>
	<title>{category.name} | Gartenwoche</title>
	<meta
		name="description"
		content="Aktuelle Artikel aus der Kategorie {category.name} auf Gartenwoche."
	/>
</svelte:head>

<div class="category-page">
	<div class="container">
		<Breadcrumb {crumbs} />
		<h1 class="category-heading">{category.name}</h1>

		{#if articles.length > 0}
			<!-- Top Mosaic: First 5 articles (Full Width) -->
			<HeroSpotlight
				article={articles[0]}
				sideArticles={articles.slice(1, 5)}
				variant="mosaic"
			/>
		{/if}

		<!-- ── 70/30 layout: main grid + sidebar ── -->
		<div class="category-layout">
			<!-- MAIN: magazine grid + pagination -->
			<div class="category-main">
				{#if articles.length === 0}
					<div class="empty-state">
						<p>Keine Beiträge vorhanden</p>
					</div>
				{:else}
					<!-- List: The rest -->
					<MagazineGrid {articles} skipFeatured={true} />

					{#if pagination}
						<Pagination
							currentPage={pagination.currentPage}
							totalPages={pagination.totalPages}
							totalArticles={pagination.totalArticles}
						/>
					{/if}
				{/if}
			</div>

			<!-- SIDEBAR: Weitere Artikel -->
			<div class="category-sidebar">
				<WeitereArtikelSidebar articles={weitereArtikel ?? []} />
				<AdBanner size="300x250" mode="awin" label={true} />
			</div>
		</div>
	</div>
</div>

<style>
	.category-page {
		padding: 20px 0 48px;
		background: #f7f7f7;
	}

	/* Spec: max-width 1200px, centered */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* Spec: Roboto 28px 900 uppercase #222 */
	.category-heading {
		font-family: "Roboto", sans-serif;
		font-size: 28px;
		font-weight: 900;
		text-transform: uppercase;
		color: #222222;
		margin: 0 0 20px;
		letter-spacing: 0.02em;
	}

	/* Spec: grid-template-columns: 1fr 300px, gap: 30px */
	.category-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 30px;
		align-items: start;
	}

	.category-main {
		min-width: 0;
	}

	.category-sidebar {
		min-width: 0;
		position: sticky;
		top: 70px; /* below the sticky nav */
	}

	.empty-state {
		background: #f7f7f7;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 24px;
		text-align: center;
	}
	.empty-state p {
		font-family: "Roboto", sans-serif;
		font-size: 14px;
		color: #999;
		margin: 0;
	}

	/* ── Responsive ─────────────────────────────────────────── */
	@media (max-width: 900px) {
		.category-layout {
			grid-template-columns: 1fr;
		}
		.category-sidebar {
			position: static;
		}
	}
</style>
