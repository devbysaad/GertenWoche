<script lang="ts">
	/**
	 * Universal catch-all page — renders either an Article or Category archive
	 * based on data.type resolved by +page.server.ts
	 */
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';
	import ProBadge from '$lib/components/ui/ProBadge.svelte';
	import ArticleBody from '$lib/components/articles/ArticleBody.svelte';
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';
	import ArticleCardSmall from '$lib/components/articles/ArticleCardSmall.svelte';
	import MagazineGrid from '$lib/components/blocks/MagazineGrid.svelte';
	import WeitereArtikelSidebar from '$lib/components/blocks/WeitereArtikelSidebar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { authStore } from '$lib/stores/auth.store.js';

	let { data } = $props();

	const isArticle = $derived(data.type === 'article');
	const isCategory = $derived(data.type === 'category');

	// Article state
	const article = $derived(isArticle ? data.article : null);
	const related = $derived(isArticle ? (data.related ?? []) : []);
	const weitereArtikelA = $derived(isArticle ? (data.weitereArtikel ?? []) : []);
	const isProGated = $derived(article?.isPro === true && $authStore.user?.tier !== 'pro');
	const canonicalUrl = $derived(article ? `https://gartenwoche.ch/${article.urlPath}` : '');
	const articleCrumbs = $derived(
		article
			? [
					{ label: article.category.name, href: `/category/${article.category.slug}` },
					...(article.subCategory
						? [{ label: article.subCategory.name, href: `/category/${article.category.slug}/${article.subCategory.slug}` }]
						: []),
					{ label: article.title }
				]
			: []
	);

	// Category state
	const category = $derived(isCategory ? data.category : null);
	const articles = $derived(isCategory ? (data.articles ?? []) : []);
	const weitereArtikelC = $derived(isCategory ? (data.weitereArtikel ?? []) : []);
	const subCategories = $derived(isCategory ? (data.subCategories ?? []) : []);
	const featuredLarge = $derived(articles[0]);
	const featuredSmall = $derived(articles.slice(1, 3));
	const gridArticles = $derived(articles.slice(3));
	const categoryCrumbs = $derived(category ? [{ label: category.name }] : []);

	// Page title / meta for svelte:head (must be top-level)
	const pageTitle = $derived(
		article ? `${article.title} | Gartenwoche` :
		category ? `${category.name} | Gartenwoche` :
		'Gartenwoche'
	);
	const pageDesc = $derived(
		article ? article.excerpt :
		category ? `Aktuelle Artikel aus der Kategorie ${category.name} auf Gartenwoche.` :
		''
	);
</script>

<!-- svelte:head must be top-level in Svelte 5 -->
<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDesc} />
	{#if article}
		<meta property="og:title" content={article.title} />
		<meta property="og:description" content={article.excerpt} />
		<meta property="og:image" content={article.thumbnail} />
		<meta property="og:type" content="article" />
		<link rel="canonical" href={canonicalUrl} />
	{/if}
</svelte:head>

<!-- ══════════════════════════════════════ -->
<!-- ARTICLE PAGE                           -->
<!-- ══════════════════════════════════════ -->
{#if isArticle && article}
	<div class="article-page">
		<div class="container">
			<Breadcrumb crumbs={articleCrumbs} />
			<div class="article-layout">

				<!-- Main -->
				<article class="article-main">
					<header class="article-header">
						<div class="article-meta-top">
							<CategoryBadge category={article.category} />
							{#if article.subCategory}
								<CategoryBadge category={article.subCategory} />
							{/if}
							{#if article.isPro}<ProBadge />{/if}
						</div>
						<!-- H1 uses Lora per spec -->
						<h1 class="article-title">{article.title}</h1>
						<div class="article-byline">
							<AuthorMeta author={article.author} publishedAt={article.publishedAt} />
						</div>
					</header>

					{#if article.thumbnail}
						<div class="article-thumb">
							<img src={article.thumbnail} alt={article.title} loading="eager" width="800" height="450" />
						</div>
					{/if}

					{#if isProGated}
						<div class="pro-gate">
							<div class="pro-gate-preview">
								<ArticleBody content={article.content.slice(0, 800) + '...'} />
							</div>
							<div class="pro-gate-overlay">
								<div class="pro-gate-card">
									<ProBadge />
									<h2>Dieser Artikel ist für PRO-Mitglieder</h2>
									<p>Lesen Sie diesen und alle anderen Artikel mit einem PRO-Abonnement.</p>
									<a href="/abonnement" class="pro-gate-btn">Jetzt PRO werden</a>
								</div>
							</div>
						</div>
					{:else}
						<ArticleBody content={article.content} />
					{/if}

					{#if article.tags?.length}
						<div class="article-tags">
							<span class="tags-label">Themen:</span>
							{#each article.tags as tag}
								<a href="/search?q={encodeURIComponent(tag)}" class="article-tag">#{tag}</a>
							{/each}
						</div>
					{/if}

					<div class="article-share">
						<span class="share-label">Teilen:</span>
						<a
							href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(canonicalUrl)}"
							target="_blank" rel="noopener noreferrer"
							class="share-btn facebook" aria-label="Auf Facebook teilen"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
							</svg>
							Facebook
						</a>
						<a
							href="https://wa.me/?text={encodeURIComponent(article.title + ' ' + canonicalUrl)}"
							target="_blank" rel="noopener noreferrer"
							class="share-btn whatsapp" aria-label="Per WhatsApp teilen"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
							</svg>
							WhatsApp
						</a>
					</div>

					{#if related.length > 0}
						<section class="related-articles">
							<h2 class="section-heading">Ähnliche Artikel</h2>
							<div class="related-grid">
								{#each related as rel}
									<ArticleCard article={rel} />
								{/each}
							</div>
						</section>
					{/if}
				</article>

				<aside class="article-sidebar">
					{#if weitereArtikelA.length > 0}
						<div class="sidebar-block">
							<h3 class="sidebar-heading">Weitere Artikel</h3>
							{#each weitereArtikelA as wa}
								<ArticleCardSmall article={wa} />
							{/each}
						</div>
					{/if}
				</aside>

			</div>
		</div>
	</div>

<!-- CATEGORY ARCHIVE PAGE -->
{:else if isCategory && category}
	<div class="category-page">
		<div class="container">
			<Breadcrumb crumbs={categoryCrumbs} />
			<h1 class="category-heading">{category.name}</h1>

			<!-- spec: grid-template-columns: 1fr 300px, gap: 30px -->
			<div class="category-layout">

				<!-- MAIN: magazine grid + pagination -->
				<div class="category-main">
					{#if articles.length === 0}
						<p class="no-articles">Keine Beiträge vorhanden.</p>
					{:else}
						<MagazineGrid {articles} />

						{#if data.pagination}
							<Pagination
								currentPage={data.pagination.currentPage}
								totalPages={data.pagination.totalPages}
								totalArticles={data.pagination.totalArticles}
							/>
						{/if}

						{#if subCategories.length > 0}
							<div class="subcats">
								{#each subCategories as sub}
									<a href="/category/{category.slug}/{sub.slug}" class="subcat-pill">
										{sub.name}
										<span class="subcat-count">({sub.count})</span>
									</a>
								{/each}
							</div>
						{/if}
					{/if}
				</div>

				<!-- SIDEBAR: Weitere Artikel -->
				<div class="category-sidebar">
					<WeitereArtikelSidebar articles={weitereArtikel ?? []} />
				</div>

			</div>
		</div>
	</div>
{/if}

<style>
	/* ══════════ ARTICLE ══════════ */
	.article-page { padding: 24px 0 48px; background: #f7f7f7; }

	.article-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 28px;
		align-items: start;
	}

	.article-main {
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 28px 32px;
		min-width: 0;
	}

	.article-header { margin-bottom: 20px; }
	.article-meta-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }

	.article-title {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(22px, 3vw, 30px);
		font-weight: 700;
		line-height: 1.25;
		color: #222;
		margin: 0 0 12px;
	}

	.article-byline { padding-bottom: 16px; border-bottom: 1px solid #e0e0e0; }
	.article-thumb { margin-bottom: 24px; overflow: hidden; }
	.article-thumb img { width: 100%; height: auto; display: block; }

	.pro-gate { position: relative; }
	.pro-gate-preview { max-height: 200px; overflow: hidden; mask-image: linear-gradient(to bottom, black 50%, transparent 100%); }
	.pro-gate-overlay { display: flex; justify-content: center; padding: 32px 0; }
	.pro-gate-card { background: #fff; border: 2px solid #F7C900; border-radius: 8px; padding: 28px 32px; text-align: center; max-width: 420px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
	.pro-gate-card h2 { font-family: 'Roboto', sans-serif; font-size: 20px; font-weight: 800; margin: 0; }
	.pro-gate-card p { font-size: 14px; color: #555; margin: 0; }
	.pro-gate-btn { display: inline-block; background: #2D1B69; color: #fff; font-weight: 700; padding: 10px 24px; border-radius: 4px; text-decoration: none; }
	.pro-gate-btn:hover { background: #4a0e4e; color: #fff; }

	.article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e0e0e0; align-items: center; }
	.tags-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #777; }
	.article-tag { font-size: 12px; color: #2D1B69; background: #f0ecf8; border: 1px solid #d0c8e8; padding: 4px 10px; border-radius: 20px; text-decoration: none; }
	.article-tag:hover { background: #2D1B69; color: #fff; }

	.article-share { display: flex; align-items: center; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
	.share-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #777; }
	.share-btn { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 4px; text-decoration: none; }
	.share-btn:hover { opacity: 0.85; }
	.facebook { background: #1877f2; color: #fff; }
	.whatsapp { background: #25d366; color: #fff; }

	.related-articles { margin-top: 36px; padding-top: 24px; border-top: 1px solid #e0e0e0; }
	.related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

	.article-sidebar { position: sticky; top: 66px; display: flex; flex-direction: column; gap: 20px; }
	.sidebar-block { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 14px 16px; }
	.sidebar-heading { font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #777; margin: 0 0 10px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; }

	/* ══════════ CATEGORY ══════════ */
	.category-page { padding: 20px 0 48px; background: #f7f7f7; }

	.category-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #222;
		margin: 0 0 20px;
		padding-bottom: 10px;
		border-bottom: 2px solid #e0e0e0;
	}

	/* Full-width, no sidebar on category pages */
	.cat-layout { display: block; }
	.weitere-sidebar { display: none; }

	/* 2-col article grid */
	.cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
	.no-articles { color: #777; font-style: italic; }

	.subcats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
	.subcat-pill { font-family: 'Roboto', sans-serif; font-size: 13px; font-weight: 500; color: #2D1B69; background: #f0ecf8; border: 1px solid #d0c8e8; padding: 5px 14px; border-radius: 20px; text-decoration: none; transition: all 0.15s; }
	.subcat-pill:hover { background: #2D1B69; color: #fff; }
	.subcat-count { font-size: 11px; color: #999; }

	/* ══════════ RESPONSIVE ══════════ */
	@media (max-width: 1023px) {
		.article-layout { grid-template-columns: 1fr; }
		.article-sidebar { position: static; }
	}

	@media (max-width: 767px) {
		.article-main { padding: 20px 16px; }
		.related-grid { grid-template-columns: 1fr; }
		.cat-grid { grid-template-columns: 1fr; }
	}


	.article-header { margin-bottom: 20px; }
	.article-meta-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }

	/* Lora H1 per spec */
	.article-title {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(24px, 3vw, 32px);
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-text);
		margin: 0 0 12px;
	}

	.article-byline { padding-bottom: 16px; border-bottom: 1px solid var(--color-border); }
	.article-thumb { margin-bottom: 24px; border-radius: var(--radius-sm); overflow: hidden; }
	.article-thumb img { width: 100%; height: auto; display: block; }

	.pro-gate { position: relative; }
	.pro-gate-preview {
		max-height: 200px;
		overflow: hidden;
		mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
	}
	.pro-gate-overlay { display: flex; justify-content: center; padding: 32px 0; }
	.pro-gate-card {
		background: var(--color-surface);
		border: 2px solid var(--color-accent);
		border-radius: var(--radius-lg);
		padding: 28px 32px;
		text-align: center;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.pro-gate-card h2 { font-family: var(--font-heading); font-size: 20px; font-weight: 800; margin: 0; }
	.pro-gate-card p { font-size: 14px; color: var(--color-text-muted); margin: 0; }
	.pro-gate-btn { display: inline-block; background: var(--color-primary); color: #fff; font-weight: 700; padding: 10px 24px; border-radius: var(--radius-sm); }
	.pro-gate-btn:hover { background: var(--color-primary-hover); color: #fff; }

	.article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border); align-items: center; }
	.tags-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
	.article-tag { font-size: 12px; color: var(--color-primary); background: var(--color-tag-bg); border: 1px solid var(--color-border); padding: 4px 10px; border-radius: 20px; }
	.article-tag:hover { background: var(--color-primary); color: #fff; }

	.article-share { display: flex; align-items: center; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
	.share-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
	.share-btn { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: var(--radius-sm); }
	.share-btn:hover { opacity: 0.85; }
	.facebook { background: #1877f2; color: #fff; }
	.whatsapp { background: #25d366; color: #fff; }

	.related-articles { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--color-border); }
	.related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

	.article-sidebar { position: sticky; top: calc(var(--header-height) + 16px); display: flex; flex-direction: column; gap: 20px; }

	.sidebar-block { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px 16px; }

	.sidebar-heading {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		margin: 0 0 10px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--color-border);
	}

	/* ══════════ CATEGORY ══════════ */
	.category-page { padding: 24px 0 48px; background: var(--color-bg); }

	.category-heading {
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		margin: 0 0 20px;
	}

	.cat-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }

	/* Featured block */
	.featured-block {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 4px;
		margin-bottom: 24px;
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.featured-large { display: block; text-decoration: none; }

	.feat-img { position: relative; height: 320px; overflow: hidden; }
	.feat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
	.featured-large:hover .feat-img img { transform: scale(1.04); }

	.feat-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #c8d8b0, #a0b878); }

	.feat-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 16px 20px;
		background: linear-gradient(to top, rgba(0,0,0,0.78), transparent);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.feat-title {
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 800;
		color: #fff;
		line-height: 1.3;
		margin: 0;
		text-shadow: 0 1px 4px rgba(0,0,0,0.5);
	}

	.feat-stack { display: grid; grid-template-rows: 1fr 1fr; gap: 4px; }
	.feat-small { display: block; text-decoration: none; }
	.feat-small-img { position: relative; height: 158px; overflow: hidden; }
	.feat-small-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
	.feat-small:hover .feat-small-img img { transform: scale(1.04); }

	.feat-small-overlay {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		padding: 10px 14px;
		background: linear-gradient(to top, rgba(0,0,0,0.72), transparent);
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

	.cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
	.no-articles { color: var(--color-text-muted); font-style: italic; }

	.subcats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
	.subcat-pill { font-size: 13px; font-weight: 600; color: var(--color-primary); background: var(--color-tag-bg); border: 1px solid var(--color-border); padding: 6px 14px; border-radius: 20px; transition: all 0.2s; }
	.subcat-pill:hover { background: var(--color-primary); color: #fff; }
	.subcat-count { font-size: 11px; color: var(--color-text-faint); }

	.weitere-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.weitere-list { list-style: none; margin: 0; padding: 0; }
	.weitere-item { border-bottom: 1px solid var(--color-border); }
	.weitere-item:last-child { border-bottom: none; }

	.weitere-link { display: flex; gap: 10px; padding: 10px 14px; text-decoration: none; transition: background 0.2s; }
	.weitere-link:hover { background: var(--color-bg); }
	.weitere-thumb { width: 64px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
	.weitere-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
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


	/* ══════════ CATEGORY ARCHIVE ══════════ */
	.category-page { padding: 20px 0 48px; background: #f7f7f7; }

	/* Spec: Roboto 28px 900 uppercase #222 */
	.category-heading {
		font-family: 'Roboto', sans-serif;
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

	.category-main { min-width: 0; }

	.category-sidebar {
		min-width: 0;
		position: sticky;
		top: 70px;
	}

	/* ══════════ RESPONSIVE ══════════ */
	@media (max-width: 1023px) {
		.article-layout, .cat-layout, .category-layout { grid-template-columns: 1fr; }
		.article-sidebar, .weitere-sidebar, .category-sidebar { position: static; }
	}

	@media (max-width: 767px) {
		.article-main { padding: 20px 16px; }
		.related-grid { grid-template-columns: 1fr; }
		.featured-block { grid-template-columns: 1fr; }
		.feat-stack { grid-template-rows: auto; grid-template-columns: 1fr 1fr; }
		.cat-grid { grid-template-columns: 1fr; }
	}
</style>
