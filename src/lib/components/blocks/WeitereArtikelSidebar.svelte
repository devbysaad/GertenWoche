<script lang="ts">
	import type { ArticlePreview } from "$lib/types/index.js";

	interface Props {
		articles: ArticlePreview[];
	}
	let { articles }: Props = $props();

	// Spec: these 5 exact articles always appear (hardcoded fallback)
	const FALLBACK: Array<{
		title: string;
		author: string;
		date: string;
		href: string;
	}> = [
		{
			title: "Nüsslisalat: Ganzjähriger Vitaminchampion",
			author: "News-Redaktion",
			date: "19. Feb 2026",
			href: "/aktuelles/nuesslisalat-ganzjaehriger-vitaminchampion",
		},
		{
			title: 'Biohybride Pflanzen: unibz entwickelt "Superpflanzen"',
			author: "Redaktion Wissen",
			date: "19. Feb 2026",
			href: "/wissen/biohybride-pflanzen-unibz",
		},
		{
			title: "Kress Voyager: hohe Mähleistung für Profis",
			author: "Redaktion Gartenpraxis",
			date: "15. Feb 2026",
			href: "/gartenpraxis/kress-voyager-hohe-maehleistung",
		},
		{
			title: "Zeitliche Veränderungen im Laubfall haben Folgen",
			author: "News-Redaktion",
			date: "15. Feb 2026",
			href: "/aktuelles/zeitliche-veraenderungen-im-laubfall",
		},
		{
			title: "Herbstpflege, die summt",
			author: "News-Redaktion",
			date: "26. Sep 2025",
			href: "/aktuelles/herbstpflege-die-summt",
		},
	];

	// Use live articles from API if available (first 5), else use hardcoded fallback
	const items = $derived(
		articles.length >= 5
			? articles.slice(0, 5).map((a) => ({
					title: a.title,
					author: a.author.name,
					date: new Date(a.publishedAt).toLocaleDateString("de-DE", {
						day: "numeric",
						month: "short",
						year: "numeric",
					}),
					href: `/${a.urlPath}`,
					thumb: a.thumbnail || "",
				}))
			: FALLBACK.map((f) => ({ ...f, thumb: "" })),
	);
</script>

<aside class="weitere-sidebar" aria-label="Weitere Artikel">
	<h2 class="sidebar-heading">Weitere Artikel</h2>

	<ul class="sidebar-list">
		{#each items as item, i}
			<li class="sidebar-card" class:last={i === items.length - 1}>
				<a href={item.href} class="sidebar-link">
					<!-- Thumbnail: 70×55px, float left, margin-right 10px -->
					<div class="sidebar-thumb">
						{#if item.thumb}
							<img
								src={item.thumb}
								alt={item.title}
								loading="lazy"
							/>
						{:else}
							<div class="thumb-ph"></div>
						{/if}
					</div>
					<!-- Text block next to float -->
					<div class="sidebar-text">
						<p class="sidebar-title">{item.title}</p>
						<p class="sidebar-meta">{item.author}</p>
						<p class="sidebar-meta">{item.date}</p>
					</div>
					<!-- clearfix -->
					<div class="clearfix"></div>
				</a>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.weitere-sidebar {
		min-width: 0;
	}

	/* Heading: Roboto 16px 700, yellow 3px border-bottom, margin-bottom 12px */
	.sidebar-heading {
		font-family: "Roboto", sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #222;
		margin: 0 0 12px;
		padding-bottom: 8px;
		border-bottom: 3px solid #f7c900;
	}

	.sidebar-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Card: border-bottom 1px #E0E0E0 except last, padding 10px 0 */
	.sidebar-card {
		border-bottom: 1px solid #e0e0e0;
		padding: 10px 0;
		overflow: hidden; /* clearfix for floats */
	}
	.sidebar-card.last {
		border-bottom: none;
	}

	.sidebar-link {
		display: block;
		text-decoration: none;
		overflow: hidden; /* clearfix */
	}

	/* Thumbnail: 70×55px, float left, margin-right 10px, border-radius 2px */
	.sidebar-thumb {
		float: left;
		width: 70px;
		height: 55px;
		margin-right: 10px;
		border-radius: 2px;
		overflow: hidden;
		background: #e0e0e0;
		flex-shrink: 0;
	}
	.sidebar-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 2px;
	}
	.thumb-ph {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #1a3a2a 0%, #2D1B69 100%);
	}

	/* Text: flows to the right of the float */
	.sidebar-text {
		overflow: hidden; /* BFC — clears the float on right side */
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* clearfix div */
	.clearfix {
		clear: both;
	}

	/* Title: Roboto 13px 700, 2-line clamp, hover #2D1B69 */
	.sidebar-title {
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.15s;
	}
	.sidebar-link:hover .sidebar-title {
		color: #2d1b69;
	}

	/* Author + Date: Open Sans 11px #555 */
	.sidebar-meta {
		font-family: "Open Sans", sans-serif;
		font-size: 11px;
		color: #555;
		margin: 0;
	}
</style>
