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
		...(article.subCategory
			? [{ label: article.subCategory.name, href: `/category/${article.category.slug}/${article.subCategory.slug}` }]
			: []),
		{ label: article.title }
	]);

	const canonicalUrl = $derived(`https://gartenwoche.ch/${article.urlPath}`);

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
</svelte:head>

<div class="article-page">
	<div class="container">
		<div class="article-layout">
			<article class="article-main">
				<Breadcrumb crumbs={crumbs} />

				<header class="article-header">
					<div class="article-meta-top">
						<CategoryBadge category={article.category} />
						{#if article.subCategory}
							<CategoryBadge category={article.subCategory} />
						{/if}
						{#if article.isPro}<ProBadge />{/if}
					</div>
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

				{#if article.tags?.length}
					<div class="article-tags">
						<span class="tags-label">Themen:</span>
						{#each article.tags as tag}
							<a href="/search?q={encodeURIComponent(tag)}" class="article-tag">#{tag}</a>
						{/each}
					</div>
				{/if}

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

			<aside class="article-sidebar">
				<ProductSidebar articles={related} />
				<EventsWidget events={[]} />
				<AdBanner size="300x250" mode="awin" label={true} />
			</aside>
		</div>
	</div>
</div>

<style>
	.article-page { padding: 24px 0 48px; background: var(--color-bg); }
	.article-layout { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; }
	.article-main { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 28px 32px; min-width: 0; }
	.article-header { margin-bottom: 20px; }
	.article-meta-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
	.article-title { font-family: var(--font-editorial); font-size: clamp(24px, 3vw, 34px); font-weight: 700; line-height: 1.25; margin-bottom: 12px; }
	.article-byline { padding-bottom: 16px; border-bottom: 1px solid var(--color-border); }
	.article-thumb { margin-bottom: 24px; border-radius: var(--radius-sm); overflow: hidden; }
	.article-thumb img { width: 100%; height: auto; display: block; }
	.content-preview { position: relative; }
	.paywall { position: relative; margin-top: -80px; padding-top: 80px; background: linear-gradient(transparent, white 60%); text-align: center; }
	.paywall-inner { background: white; border: 1px solid #E0E0E0; border-radius: 8px; padding: 32px 24px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
	.lock-icon { font-size: 32px; display: block; margin-bottom: 12px; }
	.paywall-inner h3 { font-family: 'Roboto', sans-serif; font-size: 18px; font-weight: 700; margin: 0 0 8px; }
	.paywall-inner p { font-family: 'Open Sans', sans-serif; font-size: 14px; color: #555; margin-bottom: 20px; }
	.paywall-btns { display: flex; gap: 12px; justify-content: center; }
	.btn-login { padding: 10px 20px; border: 2px solid #2D1B69; background: white; color: #2D1B69; border-radius: 4px; font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; }
	.btn-pro { padding: 10px 20px; background: #2D1B69; color: white; border-radius: 4px; font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 14px; text-decoration: none; }
	.article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border); }
	.tags-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
	.article-tag { font-size: 12px; color: var(--color-primary); background: var(--color-tag-bg); border: 1px solid var(--color-border); padding: 4px 10px; border-radius: 20px; }
	.article-tag:hover { background: var(--color-primary); color: #fff; }
	.related-articles { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--color-border); }
	.related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
	.article-sidebar { position: sticky; top: calc(var(--header-height) + 16px); display: flex; flex-direction: column; gap: 20px; }
	@media (max-width: 1023px) {
		.article-layout { grid-template-columns: 1fr; }
		.article-sidebar { position: static; }
	}
	@media (max-width: 767px) {
		.article-main { padding: 20px 16px; }
		.related-grid { grid-template-columns: 1fr; }
	}
</style>
