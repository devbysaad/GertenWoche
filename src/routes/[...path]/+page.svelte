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
	{#if article.slug === 'kampagne-japankaefer-stoppen-lanciert' || article.slug === 'kampagne-stopp-japankaefer-lanciert'}
		<div class="article-page japankaefer-page">
			<div class="container">
				<div class="article-layout">
					<!-- Main -->
					<article class="article-main">
						<header class="jk-header">
							<div class="jk-category">{article.subCategory?.name ?? article.category.name}</div>
							<h1 class="jk-title">{article.title}</h1>
							<div class="jk-divider"></div>
							
							<div class="jk-byline">
								<div class="jk-readtime">1 Minuten Lesezeit</div>
								<div class="jk-author">
									<div class="jk-avatar-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
										</svg>
									</div>
									<span class="jk-author-name">{article.author.name}</span>
								</div>
								<div class="jk-shares">
									<a href="https://www.facebook.com/sharer.php?u=https%3A%2F%2Fgartenwoche.ch%2Faktuelles%2Fschweiz%2Fkampagne-stopp-japankaefer-lanciert%2F" target="_blank" rel="noopener noreferrer" class="jk-share-link" aria-label="Facebook">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
										</svg>
									</a>
									<a href="https://x.com/intent/post?text=Kampagne+%C2%ABStopp+Japank%C3%A4fer%C2%BB+lanciert&url=https%3A%2F%2Fgartenwoche.ch%2Faktuelles%2Fschweiz%2Fkampagne-stopp-japankaefer-lanciert%2F&via=Gartenwoche" target="_blank" rel="noopener noreferrer" class="jk-share-link" aria-label="X">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.636 5.902-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
										</svg>
									</a>
									<a href="https://pinterest.com/pin/create/button/?url=https://gartenwoche.ch/aktuelles/schweiz/kampagne-stopp-japankaefer-lanciert/&media=https://gartenwoche.ch/wp-content/uploads/2026/05/stopp-dem-japankaefer.webp&description=Kampagne+%C2%ABStopp+Japank%C3%A4fer%C2%BB+lanciert" target="_blank" rel="noopener noreferrer" class="jk-share-link" aria-label="Pinterest">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
										</svg>
									</a>
									<a href="https://api.whatsapp.com/send?text=Kampagne+%C2%ABStopp+Japank%C3%A4fer%C2%BB+lanciert %0A%0A https://gartenwoche.ch/aktuelles/schweiz/kampagne-stopp-japankaefer-lanciert/" target="_blank" rel="noopener noreferrer" class="jk-share-link" aria-label="WhatsApp">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.223h.002c5.505 0 9.988-4.478 9.989-9.985-.001-2.669-1.041-5.176-2.929-7.065A9.925 9.925 0 0 0 12.012 2zm5.71 14.283c-.244.686-1.413 1.312-1.975 1.396-.505.076-1.144.108-1.849-.117-.428-.136-.974-.316-1.677-.62-2.946-1.272-4.87-4.237-5.017-4.433-.146-.196-1.2-1.595-1.2-3.04.001-1.444.747-2.152.992-2.399.245-.246.533-.308.71-.308.178 0 .356.002.511.01.162.008.384-.06.602.463.223.535.762 1.859.828 1.993.066.134.11.29.02.469-.089.179-.134.29-.267.447-.134.156-.281.348-.401.468-.134.134-.275.28-.119.549.156.268.694 1.143 1.488 1.849.794.706 1.462 1.133 1.73 1.267.268.134.423.112.579-.067.156-.179.67-.781.848-1.049.178-.268.356-.223.579-.134.223.089 1.413.67 1.657.792.245.123.408.184.467.29.06.106.06.614-.184 1.3z"/>
										</svg>
									</a>
									<a href="mailto:?subject=Kampagne «Stopp Japankäfer» lanciert&body=https://gartenwoche.ch/aktuelles/schweiz/kampagne-stopp-japankaefer-lanciert/" class="jk-share-link" aria-label="E-Mail">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
										</svg>
									</a>
									<a href="#" onclick={(e) => { e.preventDefault(); window.print(); }} class="jk-share-link" aria-label="Print">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
											<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
										</svg>
									</a>
								</div>
							</div>
						</header>

						<p class="jk-excerpt">{article.excerpt}</p>

						{#if article.thumbnail}
							<div class="jk-thumb">
								<img
									src={article.thumbnail}
									alt={article.title}
									loading="eager"
								/>
							</div>
						{/if}

						<div class="jk-body">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html article.content}
						</div>

						<!-- COMMENT FORM (Screenshot 2) -->
						<section class="jk-comment-section">
							<h3 class="jk-comment-title">Kommentieren Sie den Artikel</h3>
							<form class="jk-comment-form" onsubmit={(e) => e.preventDefault()}>
								<div class="jk-form-row">
									<div class="jk-form-group">
										<input type="text" id="jk-name" placeholder="Name:*" required class="jk-input" />
									</div>
									<div class="jk-form-group">
										<input type="email" id="jk-email" placeholder="E-Mail:*" required class="jk-input" />
									</div>
									<div class="jk-form-group">
										<input type="url" id="jk-website" placeholder="Website:" class="jk-input" />
									</div>
								</div>
								
								<div class="jk-form-checkbox-row">
									<input type="checkbox" id="jk-save-info" class="jk-checkbox" />
									<label for="jk-save-info" class="jk-checkbox-label">
										Speichern Sie meinen Namen, meine E-Mail-Adresse und meine Website für den nächsten Kommentar in diesem Browser.
									</label>
								</div>

								<div class="jk-form-group textarea-group">
									<textarea id="jk-comment" placeholder="Kommentar:" required class="jk-textarea"></textarea>
								</div>

								<div class="jk-form-submit-row">
									<button type="submit" class="jk-submit-btn">Kommentar speichern</button>
								</div>
							</form>
						</section>
					</article>
				</div>
			</div>
		</div>
	{:else}
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
	{/if}

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
		font-family: var(--td_default_google_font_1), Georgia, serif;
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

	/* ══════════ JAPANKÄFER CUSTOM LAYOUT ══════════ */
	.japankaefer-page {
		background: #ffffff;
		padding: 60px 0 80px;
	}

	.japankaefer-page .article-layout {
		display: block;
		max-width: 800px;
		margin: 0 auto;
	}

	.japankaefer-page .article-main {
		border: none;
		border-radius: 0;
		padding: 0;
		background: #ffffff;
	}

	.jk-header {
		text-align: center;
		margin-bottom: 24px;
	}

	.jk-category {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 500;
		color: #006633;
		text-transform: none;
		letter-spacing: 0.02em;
		margin-bottom: 12px;
		text-align: center;
	}

	.jk-title {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: clamp(28px, 4vw, 42px);
		font-weight: 400;
		line-height: 1.2;
		color: #0b4650;
		margin: 0 auto 16px;
		text-align: center;
		max-width: 720px;
	}

	.jk-divider {
		height: 1px;
		background: #006633;
		width: 150px;
		margin: 20px auto;
	}

	.jk-byline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		margin: 24px 0 32px;
		border-top: none;
		border-bottom: none;
		flex-wrap: wrap;
		gap: 16px;
	}

	.jk-readtime {
		font-family: var(--font-body);
		font-size: 13px;
		color: #1a1a1a;
	}

	.jk-author {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.jk-avatar-icon {
		width: 28px;
		height: 28px;
		color: #b0bec5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.jk-author-name {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		color: #37474f;
	}

	.jk-shares {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.jk-share-link {
		color: #1a1a1a;
		transition: color 0.2s ease;
		display: flex;
		align-items: center;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: bold;
	}

	.jk-share-link:hover {
		color: #006633;
	}

	.jk-excerpt {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 20px;
		font-style: italic;
		line-height: 1.5;
		color: #555555;
		margin: 0 0 32px;
		font-weight: 300;
	}

	.jk-thumb {
		margin: 0 0 40px;
		width: 100%;
		overflow: hidden;
	}

	.jk-thumb img {
		width: 100%;
		height: auto;
		display: block;
	}

	.jk-body {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 18px;
		line-height: 1.8;
		color: #2b2b2b;
		margin-bottom: 60px;
	}

	.jk-body :global(p) {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 18px;
		line-height: 1.8;
		color: #2b2b2b;
		margin-bottom: 1.5em;
	}

	/* COMMENT FORM STYLING (Screenshot 2) */
	.jk-comment-section {
		margin-top: 60px;
		padding-top: 40px;
		border-top: 1px solid #e0e0e0;
	}

	.jk-comment-title {
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 700;
		color: #222222;
		margin-bottom: 24px;
		text-transform: none;
	}

	.jk-comment-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.jk-form-row {
		display: flex;
		gap: 16px;
		width: 100%;
	}

	.jk-form-group {
		flex: 1;
		min-width: 0;
	}

	.jk-input {
		width: 100%;
		border: 1px solid #d2d2d2;
		padding: 10px 14px;
		font-family: var(--font-body);
		font-size: 14px;
		background: #ffffff;
		outline: none;
		transition: border-color 0.2s;
	}

	.jk-input:focus {
		border-color: #006633;
	}

	.jk-form-checkbox-row {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		margin: 4px 0;
	}

	.jk-checkbox {
		margin-top: 6px;
		width: 15px;
		height: 15px;
		cursor: pointer;
		accent-color: #006633;
	}

	.jk-checkbox-label {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 17px;
		line-height: 1.4;
		color: #2b2b2b;
		cursor: pointer;
		user-select: none;
	}

	.textarea-group {
		width: 100%;
	}

	.jk-textarea {
		width: 100%;
		height: 200px;
		border: 1px solid #d2d2d2;
		padding: 12px 14px;
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 18px;
		background: #ffffff;
		outline: none;
		resize: vertical;
		transition: border-color 0.2s;
	}

	.jk-textarea:focus {
		border-color: #006633;
	}

	.jk-textarea::placeholder {
		color: #888888;
	}

	.jk-input::placeholder {
		color: #888888;
	}

	.jk-form-submit-row {
		display: flex;
		justify-content: flex-start;
	}

	.jk-submit-btn {
		background: #1a1a1a;
		color: #ffffff;
		border: none;
		padding: 12px 24px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		text-transform: none;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.jk-submit-btn:hover {
		background: #006633;
	}

	@media (max-width: 768px) {
		.jk-form-row {
			flex-direction: column;
			gap: 12px;
		}
		.jk-byline {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
		.jk-shares {
			width: 100%;
			justify-content: space-between;
		}
	}
</style>
