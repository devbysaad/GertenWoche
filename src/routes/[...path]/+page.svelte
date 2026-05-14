<script lang="ts">
	/**
	 * Universal catch-all page — renders either an Article or Category archive
	 * based on data.type resolved by +page.server.ts
	 */
	import Breadcrumb from "$lib/components/ui/Breadcrumb.svelte";
	import CategoryBadge from "$lib/components/ui/CategoryBadge.svelte";
	import AuthorMeta from "$lib/components/ui/AuthorMeta.svelte";
	import ProBadge from "$lib/components/ui/ProBadge.svelte";
	import ArticleBody from "$lib/components/articles/ArticleBody.svelte";
	import ArticleCard from "$lib/components/articles/ArticleCard.svelte";
	import ArticleCardSmall from "$lib/components/articles/ArticleCardSmall.svelte";
	import MagazineGrid from "$lib/components/blocks/MagazineGrid.svelte";
	import WeitereArtikelSidebar from "$lib/components/blocks/WeitereArtikelSidebar.svelte";
	import Pagination from "$lib/components/ui/Pagination.svelte";
	import { modalStore } from "$lib/stores/modal.store.js";

	let { data } = $props();

	const isArticle = $derived(data.type === "article");
	const isCategory = $derived(data.type === "category");

	// Article state
	const article = $derived(isArticle ? data.article : null);
	const related = $derived(isArticle ? (data.related ?? []) : []);
	const weitereArtikelA = $derived(
		isArticle ? (data.weitereArtikel ?? []) : [],
	);
	// Use server-side user.isPro for paywall — never trust client store alone
	const isProGated = $derived(article?.isPro === true && !data.user?.isPro);
	const canonicalUrl = $derived(
		article ? `https://gartenwoche.ch/${article.urlPath}` : "",
	);

	/** Return first N <p> tags from HTML for paywall preview */
	function getFirstParagraphs(html: string, count: number): string {
		const matches = html.match(/<p[\s\S]*?<\/p>/gi) ?? [];
		return matches.slice(0, count).join("");
	}
	const articleCrumbs = $derived(
		article
			? [
					{
						label: article.category.name,
						href: `/category/${article.category.slug}`,
					},
					...(article.subCategory
						? [
								{
									label: article.subCategory.name,
									href: `/category/${article.category.slug}/${article.subCategory.slug}`,
								},
							]
						: []),
					{ label: article.title },
				]
			: [],
	);

	// Category state
	const category = $derived(isCategory ? data.category : null);
	const articles = $derived(isCategory ? (data.articles ?? []) : []);
	const weitereArtikelC = $derived(
		isCategory ? (data.weitereArtikel ?? []) : [],
	);
	const subCategories = $derived(
		isCategory ? (data.subCategories ?? []) : [],
	);
	const categoryCrumbs = $derived(category ? [{ label: category.name }] : []);

	// Page title / meta for svelte:head (must be top-level)
	const pageTitle = $derived(
		article
			? `${article.title} | Gartenwoche`
			: category
				? `${category.name} | Gartenwoche`
				: "Gartenwoche",
	);
	const pageDesc = $derived(
		article
			? article.excerpt
			: category
				? `Aktuelle Artikel aus der Kategorie ${category.name} auf Gartenwoche.`
				: "",
	);
</script>

<!-- svelte:head must be top-level in Svelte 5 -->
<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDesc} />
	{#if article}
		<meta property="og:title" content={article.title} />
		<meta property="og:description" content={article.excerpt} />
		<meta
			property="og:image"
			content={article.thumbnail ||
				"https://gartenwoche.ch/Logo_Gartenwoche-1.png"}
		/>
		<meta property="og:type" content="article" />
		<meta property="og:url" content={canonicalUrl} />
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
							<AuthorMeta
								author={article.author}
								publishedAt={article.publishedAt}
							/>
						</div>
					</header>

					{#if article.thumbnail}
						<div class="article-thumb">
							<img
								src={article.thumbnail}
								alt={article.title}
								loading="eager"
								width="800"
								height="450"
							/>
						</div>
					{/if}

					{#if isProGated}
						<!-- Paywall: show first 3 paragraphs + fade + lock box -->
						<div class="pro-gate">
							<div class="pro-gate-preview">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class="prose article-body">
									{@html getFirstParagraphs(
										article.content,
										3,
									)}
								</div>
							</div>
							<div class="pro-gate-overlay">
								<div class="pro-gate-card">
									<span class="lock-icon">🔒</span>
									<h2>
										Dieser Artikel ist nur für Mitglieder
									</h2>
									<p>
										Melden Sie sich an oder werden Sie
										PRO-Mitglied für vollen Zugang.
									</p>
									<div class="paywall-btns">
										{#if !data.user}
											<button
												class="btn-login"
												type="button"
												onclick={() =>
													modalStore.openLogin()}
												>Anmelden</button
											>
										{/if}
										<a href="/abonnement" class="btn-pro"
											>Jetzt PRO werden</a
										>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<ArticleBody
							content={article.content}
							showMidAd={true}
						/>
					{/if}

					{#if article.tags?.length}
						<div class="article-tags">
							<span class="tags-label">Themen:</span>
							{#each article.tags as tag}
								<a
									href="/search?q={encodeURIComponent(tag)}"
									class="article-tag">#{tag}</a
								>
							{/each}
						</div>
					{/if}

					<div class="article-share">
						<span class="share-label">Teilen:</span>
						<a
							href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(
								canonicalUrl,
							)}"
							target="_blank"
							rel="noopener noreferrer"
							class="share-btn facebook"
							aria-label="Auf Facebook teilen"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
								/>
							</svg>
							Facebook
						</a>
						<a
							href="https://wa.me/?text={encodeURIComponent(
								article.title + ' ' + canonicalUrl,
							)}"
							target="_blank"
							rel="noopener noreferrer"
							class="share-btn whatsapp"
							aria-label="Per WhatsApp teilen"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
								/>
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

	<!-- ══════════════════════════════════════ -->
	<!-- CATEGORY ARCHIVE PAGE                  -->
	<!-- ══════════════════════════════════════ -->
{:else if isCategory && category}
	<div class="category-page">
		<div class="container">
			<Breadcrumb crumbs={categoryCrumbs} />

			<!-- Spec: Roboto 28px 900 uppercase #222 -->
			<h1 class="category-heading">{category.name}</h1>

			<!-- Spec: grid-template-columns: 1fr 300px, gap: 30px -->
			<div class="category-layout">
				<!-- MAIN: magazine grid + pagination -->
				<div class="category-main">
					{#if articles.length === 0}
						<div class="empty-state">
							<p>Keine Beiträge vorhanden</p>
						</div>
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
									<a
										href="/category/{category.slug}/{sub.slug}"
										class="subcat-pill"
									>
										{sub.name}
										<span class="subcat-count"
											>({sub.count})</span
										>
									</a>
								{/each}
							</div>
						{/if}
					{/if}
				</div>

				<!-- SIDEBAR: Weitere Artikel -->
				<div class="category-sidebar">
					<WeitereArtikelSidebar articles={weitereArtikelC} />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ══════════ ARTICLE ══════════ */
	.article-page {
		padding: 24px 0 48px;
		background: #f7f7f7;
	}

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

	.article-header {
		margin-bottom: 20px;
	}
	.article-meta-top {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}

	/* Lora H1 per spec */
	.article-title {
		font-family: "Lora", Georgia, serif;
		font-size: clamp(24px, 3vw, 32px);
		font-weight: 700;
		line-height: 1.25;
		color: #222;
		margin: 0 0 12px;
	}

	.article-byline {
		padding-bottom: 16px;
		border-bottom: 1px solid #e0e0e0;
	}
	.article-thumb {
		margin-bottom: 24px;
		overflow: hidden;
		border-radius: 4px;
	}
	.article-thumb img {
		width: 100%;
		height: auto;
		display: block;
	}

	.pro-gate {
		position: relative;
	}
	.pro-gate-preview {
		max-height: 240px;
		overflow: hidden;
		mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 40%,
			transparent 100%
		);
	}
	.pro-gate-overlay {
		display: flex;
		justify-content: center;
		padding: 32px 0;
		margin-top: -80px;
	}
	.pro-gate-card {
		background: white;
		border: 2px solid #f7c900;
		border-radius: 8px;
		padding: 28px 32px;
		text-align: center;
		max-width: 480px;
		width: 100%;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.lock-icon {
		font-size: 32px;
		display: block;
	}
	.pro-gate-card h2 {
		font-family: "Roboto", sans-serif;
		font-size: 18px;
		font-weight: 700;
		margin: 0;
	}
	.pro-gate-card p {
		font-size: 14px;
		color: #555;
		margin: 0;
	}
	.paywall-btns {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}
	.btn-login {
		padding: 10px 20px;
		border: 2px solid #2d1b69;
		background: white;
		color: #2d1b69;
		border-radius: 4px;
		font-family: "Roboto", sans-serif;
		font-weight: 700;
		font-size: 14px;
		cursor: pointer;
	}
	.btn-login:hover {
		background: #f0ecf8;
	}
	.btn-pro {
		display: inline-block;
		padding: 10px 20px;
		background: #2d1b69;
		color: white;
		border-radius: 4px;
		font-family: "Roboto", sans-serif;
		font-weight: 700;
		font-size: 14px;
		text-decoration: none;
	}
	.btn-pro:hover {
		background: #4a0e4e;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 32px;
		padding-top: 20px;
		border-top: 1px solid #e0e0e0;
		align-items: center;
	}
	.tags-label {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		color: #777;
	}
	.article-tag {
		font-size: 12px;
		color: #2d1b69;
		background: #f0ecf8;
		border: 1px solid #d0c8e8;
		padding: 4px 10px;
		border-radius: 20px;
		text-decoration: none;
	}
	.article-tag:hover {
		background: #2d1b69;
		color: #fff;
	}

	.article-share {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 16px;
		flex-wrap: wrap;
	}
	.share-label {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		color: #777;
	}
	.share-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		padding: 6px 14px;
		border-radius: 4px;
		text-decoration: none;
	}
	.share-btn:hover {
		opacity: 0.85;
	}
	.facebook {
		background: #1877f2;
		color: #fff;
	}
	.whatsapp {
		background: #25d366;
		color: #fff;
	}

	.related-articles {
		margin-top: 36px;
		padding-top: 24px;
		border-top: 1px solid #e0e0e0;
	}
	.related-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.article-sidebar {
		position: sticky;
		top: 70px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.sidebar-block {
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 14px 16px;
	}
	.sidebar-heading {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #777;
		margin: 0 0 10px;
		padding-bottom: 8px;
		border-bottom: 1px solid #e0e0e0;
	}

	/* ══════════ CATEGORY ══════════ */
	.category-page {
		padding: 20px 0 48px;
		background: #f7f7f7;
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
		top: 70px;
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

	.subcats {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 16px;
	}
	.subcat-pill {
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: #2d1b69;
		background: #f0ecf8;
		border: 1px solid #d0c8e8;
		padding: 5px 14px;
		border-radius: 20px;
		text-decoration: none;
		transition: all 0.15s;
	}
	.subcat-pill:hover {
		background: #2d1b69;
		color: #fff;
	}
	.subcat-count {
		font-size: 11px;
		color: #999;
	}

	/* ══════════ RESPONSIVE ══════════ */
	@media (max-width: 1023px) {
		.article-layout,
		.category-layout {
			grid-template-columns: 1fr;
		}
		.article-sidebar,
		.category-sidebar {
			position: static;
		}
	}

	@media (max-width: 767px) {
		.article-main {
			padding: 20px 16px;
		}
		.related-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
