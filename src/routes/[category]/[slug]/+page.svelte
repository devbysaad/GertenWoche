<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import CategoryBadge from '$lib/components/ui/CategoryBadge.svelte';
	import AuthorMeta from '$lib/components/ui/AuthorMeta.svelte';
	import ProBadge from '$lib/components/ui/ProBadge.svelte';
	import ArticleBody from '$lib/components/articles/ArticleBody.svelte';
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';
	import ProductSidebar from '$lib/components/blocks/ProductSidebar.svelte';
	import EventsWidget from '$lib/components/blocks/EventsWidget.svelte';
	import AdBanner from '$lib/components/ui/AdBanner.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';
	import { getFirstParagraphs } from '$lib/utils/article.js';

	let { data } = $props();
	const { article, related } = $derived(data);
	const user = $derived(data.user);

	const isLocked = $derived(article.isPro && !user?.isPro);

	const crumbs = $derived([
		{ label: article.category.name, href: `/category/${article.category.slug}` },
		{ label: article.title }
	]);

	const canonicalUrl = $derived(
		`https://gartenwoche.ch/${article.category.slug}/${article.slug}`
	);

	function openLogin() {
		modalStore.openLogin();
	}
</script>

<svelte:head>
	<title>{article.title} | Gartenwoche</title>
	<meta name="description" content={article.excerpt} />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={article.excerpt} />
	<meta property="og:image" content={article.thumbnail} />
	<meta property="og:type" content="article" />
	<link rel="canonical" href={canonicalUrl} />
	<script type="application/ld+json">
	{JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": article.title,
		"image": article.thumbnail,
		"datePublished": article.publishedAt.toISOString(),
		"dateModified": article.updatedAt.toISOString(),
		"author": { "@type": "Person", "name": article.author.name },
		"publisher": { "@type": "Organization", "name": "Gartenwoche" },
		"description": article.excerpt
	})}
	</script>
</svelte:head>

<div class="article-page">
	<div class="container">
		<div class="article-layout">
			<!-- Main article -->
			<article class="article-main">
				<Breadcrumb crumbs={crumbs} />

				<!-- Header -->
				<header class="article-header">
					<div class="article-meta-top">
						<CategoryBadge category={article.category} />
						{#if article.isPro}<ProBadge />{/if}
					</div>

					<h1 class="article-title">{article.title}</h1>

					<div class="article-byline">
						<AuthorMeta author={article.author} publishedAt={article.publishedAt} />
					</div>
				</header>

				<!-- Featured image -->
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

				{#if isLocked}
					<div class="content-preview">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div class="prose article-body-preview">{@html getFirstParagraphs(article.content, 3)}</div>
					</div>

					<div class="paywall">
						<div class="paywall-inner">
							<span class="lock-icon">🔒</span>
							<h3>Dieser Artikel ist nur für PRO-Mitglieder</h3>
							<p>Melden Sie sich an oder werden Sie PRO-Mitglied für vollen Zugang.</p>
							<div class="paywall-btns">
								{#if !user}
									<button class="btn-login" onclick={openLogin}>Anmelden</button>
								{/if}
								<a href="/abonnement" class="btn-pro">Jetzt PRO werden</a>
							</div>
						</div>
					</div>
				{:else}
					<ArticleBody content={article.content} showMidAd={true} />
				{/if}

				<!-- Tags -->
				{#if article.tags?.length}
					<div class="article-tags">
						<span class="tags-label">Themen:</span>
						{#each article.tags as tag}
							<a href="/search?q={encodeURIComponent(tag)}" class="article-tag">#{tag}</a>
						{/each}
					</div>
				{/if}

				<!-- Social share -->
				<div class="article-share">
					<span class="share-label">Teilen:</span>
					<a
						href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(canonicalUrl)}"
						target="_blank"
						rel="noopener noreferrer"
						class="share-btn facebook"
						aria-label="Auf Facebook teilen"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
						</svg>
						Facebook
					</a>
					<a
						href="https://wa.me/?text={encodeURIComponent(article.title + ' ' + canonicalUrl)}"
						target="_blank"
						rel="noopener noreferrer"
						class="share-btn whatsapp"
						aria-label="Per WhatsApp teilen"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
						</svg>
						WhatsApp
					</a>
				</div>

				<!-- Related articles -->
				{#if related.length > 0}
					<section class="related-articles">
						<h2 class="section-heading">Ähnliche Artikel</h2>
						<div class="related-grid">
							{#each related as relArticle}
								<ArticleCard article={relArticle} />
							{/each}
						</div>
					</section>
				{/if}
			</article>

			<!-- Sidebar -->
			<aside class="article-sidebar">
				<ProductSidebar articles={related} />
				<div class="sidebar-spacer">
					<EventsWidget events={[]} />
				</div>
				<AdBanner size="300x250" mode="awin" label={true} />
			</aside>
		</div>
	</div>
</div>

<style>
	.article-page {
		padding: 24px 0 48px;
		background: var(--color-bg);
	}

	.article-layout {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 32px;
		align-items: start;
	}

	/* Article main */
	.article-main {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
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
		margin-bottom: 12px;
	}

	.article-title {
		font-family: var(--font-editorial);
		font-size: clamp(26px, 3.5vw, 36px);
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-text);
		margin-bottom: 12px;
	}

	.article-byline {
		padding-bottom: 16px;
		border-bottom: 1px solid var(--color-border);
	}

	.article-thumb {
		margin-bottom: 24px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.article-thumb img {
		width: 100%;
		height: auto;
		display: block;
	}

	.content-preview {
		position: relative;
	}

	.paywall {
		position: relative;
		margin-top: -80px;
		padding-top: 80px;
		background: linear-gradient(transparent, white 60%);
		text-align: center;
	}

	.paywall-inner {
		background: white;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		padding: 32px 24px;
		max-width: 480px;
		margin: 0 auto;
		box-shadow: 0 4px 24px rgba(0,0,0,0.08);
	}

	.lock-icon { font-size: 32px; display: block; margin-bottom: 12px; }

	.paywall-inner h3 {
		font-family: 'Roboto', sans-serif;
		font-size: 20px;
		font-weight: 700;
		margin: 0;
	}

	.paywall-inner p {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #555;
		margin-bottom: 20px;
	}

	.paywall-btns { display: flex; gap: 12px; justify-content: center; }

	.btn-login {
		padding: 10px 20px;
		border: 2px solid #2D1B69;
		background: white;
		color: #2D1B69;
		border-radius: 4px;
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 14px;
		cursor: pointer;
	}

	.btn-pro {
		padding: 10px 20px;
		background: #2D1B69;
		color: white;
		border-radius: 4px;
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 14px;
		text-decoration: none;
	}

	/* Tags */
	.article-tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin-top: 32px;
		padding-top: 20px;
		border-top: 1px solid var(--color-border);
	}

	.tags-label {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.article-tag {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-primary);
		background: var(--color-tag-bg);
		border: 1px solid var(--color-border);
		padding: 4px 10px;
		border-radius: 20px;
		transition: all 0.2s ease;
	}

	.article-tag:hover {
		background: var(--color-primary);
		color: #fff;
		border-color: var(--color-primary);
	}

	/* Share */
	.article-share {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 16px;
		flex-wrap: wrap;
	}

	.share-label {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.share-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		transition: opacity 0.2s ease;
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

	/* Related articles */
	.related-articles {
		margin-top: 36px;
		padding-top: 24px;
		border-top: 1px solid var(--color-border);
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	/* Sidebar */
	.article-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.sidebar-spacer {
		display: block;
	}

	/* Responsive */
	@media (max-width: 1023px) {
		.article-layout {
			grid-template-columns: 1fr;
		}

		.article-sidebar {
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
