<script lang="ts">
	/**
	 * @component HeroSpotlight
	 * ─────────────────────────────────────────────────────────
	 * Dual-purpose hero/spotlight component used in two places:
	 *
	 * 1. HOMEPAGE  (variant="homepage")
	 *    Layout: [ Large image (65%) | Stacked mini-cards (35%) ]
	 *    The main article overlays a floating editorial box that
	 *    "hangs" half out of the image bottom edge.
	 *
	 * 2. CATEGORY PAGES  (variant="mosaic")
	 *    Layout: [ 2 cols left | Big center | 2 cols right ]
	 *    Accepts 1 main article + up to 4 side articles.
	 *
	 * Props:
	 *  article       — main/center article (always required)
	 *  sideArticles  — supporting articles (2 for homepage, 4 for mosaic)
	 *  variant       — "homepage" | "mosaic" (default: "mosaic")
	 */
	import type { ArticlePreview } from "$lib/types/index.js";

	interface Props {
		article: ArticlePreview; // main hero (large, left)
		sideArticles?: ArticlePreview[]; // for mosaic mode (4 corners)
		variant?: "homepage" | "mosaic"; // layout variant
	}
	let { article, sideArticles = [], variant = "mosaic" }: Props = $props();

	const url = $derived(`/${article.urlPath}`);

	// Mosaic: 2 left, 2 right
	const leftArticles = $derived(sideArticles.slice(0, 2));
	const rightArticles = $derived(sideArticles.slice(2, 4));

	// Homepage: 2 stacked right
	const rightStack = $derived(sideArticles.slice(0, 2));

	type HeroArticle = ArticlePreview & { content?: string };

	function plainText(html: string): string {
		return html
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	}

	/** Full lead text for hero overlay (WP excerpt, else start of body). */
	const overlayBody = $derived.by(() => {
		const a = article as HeroArticle;
		const excerpt = a.excerpt?.trim() ?? "";
		if (excerpt.length >= 200) return excerpt;
		if (a.content) {
			const fromContent = plainText(a.content);
			return excerpt || fromContent.slice(0, 1500);
		}
		return excerpt;
	});
</script>

<!-- ════════════════════════════════════════════════════════
	 HOMEPAGE VARIANT: large left (O) + 2 small stacked right (o / o)
	 ════════════════════════════════════════════════════════ -->
{#if variant === "homepage"}
	<section class="hero-section hero-home" aria-label="Hauptartikel">
		<div class="homepage-grid">
			<!-- LEFT: large hero image with article overlay at bottom -->
			<a href={url} class="hero-img-link" tabindex="0">
				{#if article.thumbnail && article.thumbnail.trim() !== ""}
					<img
						src={article.thumbnail}
						alt={article.title}
						loading="eager"
						fetchpriority="high"
						class="hero-img"
					/>
				{:else}
					<div class="hero-img hero-fallback">
						<span class="fallback-label"
							>{article.category.name}</span
						>
					</div>
				{/if}
				<div class="hero-overlay">
					<p class="hero-overlay-title">{article.title}</p>
					<span class="hero-overlay-author"
						>{article.author.name}</span
					>
					{#if overlayBody}
						<p class="hero-overlay-excerpt">{overlayBody}</p>
					{/if}
				</div>
			</a>

			<!-- RIGHT: 2 smaller stacked cards -->
			<div class="hrc-stack">
				{#each rightStack.slice(0, 1) as art}
					{@const artUrl = `/${art.urlPath}`}
					<a href={artUrl} class="hrc-mini-card">
						<div class="hrc-img">
							{#if art.thumbnail && art.thumbnail.trim() !== ""}
								<img
									src={art.thumbnail}
									alt={art.title}
									loading="lazy"
								/>
							{:else}
								<div class="hrc-ph"></div>
							{/if}
							<span class="hrc-badge">{art.category.name}</span>
						</div>
						<div class="hrc-body">
							<p class="hrc-title">{art.title}</p>
							{#if art.excerpt}
								<p class="hrc-excerpt">{art.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════════
	 MOSAIC VARIANT: o o / O / o o  (used on category pages)
	 ════════════════════════════════════════════════════════ -->
{:else}
	<section class="hero-section" aria-label="Aktuelle Beiträge">
		<div class="mosaic-grid">
			<!-- LEFT COLUMN: 2 small -->
			<div class="mosaic-side">
				{#each leftArticles as art}
					{@const artUrl = `/${art.urlPath}`}
					<a href={artUrl} class="side-card">
						<div class="side-img">
							{#if art.thumbnail && art.thumbnail.trim() !== ""}
								<img
									src={art.thumbnail}
									alt={art.title}
									loading="lazy"
								/>
							{:else}
								<div class="img-ph img-gradient"></div>
							{/if}
						</div>
						<div class="side-overlay">
							<span class="cat-badge sm-badge"
								>{art.category.name}</span
							>
							<p class="side-title">{art.title}</p>
						</div>
					</a>
				{/each}
			</div>

			<!-- CENTER: large hero -->
			<a href={url} class="mosaic-center">
				<div class="center-img">
					{#if article.thumbnail && article.thumbnail.trim() !== ""}
						<img
							src={article.thumbnail}
							alt={article.title}
							loading="eager"
							fetchpriority="high"
						/>
					{:else}
						<div class="img-ph img-gradient"></div>
					{/if}
				</div>
				<div class="center-overlay">
					<span class="cat-badge">{article.category.name}</span>
					<h1 class="center-title">{article.title}</h1>
					<span class="center-author">{article.author.name}</span>
				</div>
			</a>

			<!-- RIGHT COLUMN: 2 small -->
			<div class="mosaic-side">
				{#each rightArticles as art}
					{@const artUrl = `/${art.urlPath}`}
					<a href={artUrl} class="side-card">
						<div class="side-img">
							{#if art.thumbnail && art.thumbnail.trim() !== ""}
								<img
									src={art.thumbnail}
									alt={art.title}
									loading="lazy"
								/>
							{:else}
								<div class="img-ph img-gradient"></div>
							{/if}
						</div>
						<div class="side-overlay">
							<span class="cat-badge sm-badge"
								>{art.category.name}</span
							>
							<p class="side-title">{art.title}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.hero-section {
		margin-bottom: 32px;
	}
	.hero-home {
		margin-bottom: 240px; /* Space for tall hanging overlay */
	}

	/* ── Category badge (mosaic shared) ── */
	.cat-badge {
		display: inline-block;
		background: #111; /* Changed to black as requested */
		color: #fff;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 2px 7px;
		border-radius: 2px;
		letter-spacing: 0.04em;
	}
	.sm-badge {
		font-size: 9px;
		padding: 1px 5px;
	}

	/* shared image fade overlay */
	.img-ph {
		width: 100%;
		height: 100%;
		background: #333;
	}
	.img-gradient {
		background: linear-gradient(135deg, #1a3a2a 0%, #2a2a2a 100%);
	}

	/* Homepage hero fallback */
	.hero-fallback {
		background: linear-gradient(135deg, #2a2a2a 0%, #444 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.fallback-label {
		font-family: "Roboto", sans-serif;
		font-size: 24px;
		font-weight: 900;
		color: rgba(255, 255, 255, 0.25);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	/* ══════════════════════════════════════
	   HOMEPAGE: 70% image | 30% text panel
	   ══════════════════════════════════════ */
	.homepage-grid {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
		gap: 28px;
		height: 520px;
		max-height: 520px;
		background: transparent;
		border: none;
		overflow: visible;
	}

	/* LEFT: relative container — image fills it, overlay is absolute */
	.hero-img-link {
		position: relative;
		display: block;
		overflow: visible;
		height: 100%;
		text-decoration: none;
	}
	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		border-radius: 0;
		transition: transform 0.4s ease;
	}
	.hero-img-link:hover .hero-img {
		transform: scale(1.02);
	}

	/* Hanging editorial box — centered, 750px max */
	.hero-overlay {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 55%);
		width: min(calc(100% - 40px), 750px);
		max-width: 750px;
		background: #ecf3f0;
		padding: 40px 44px 48px;
		display: flex;
		flex-direction: column;
		gap: 0;
		border-radius: 0;
		box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
		z-index: 10;
		pointer-events: auto;
	}

	.hero-overlay-title {
		font-family: var(--font-editorial);
		font-size: 26px;
		font-weight: 400;
		color: #000;
		margin: 0 0 10px;
		line-height: 1.32;
	}

	.hero-overlay-author {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #000;
		margin: 0 0 18px;
		line-height: 1.2;
	}

	.hero-overlay-excerpt {
		font-family: var(--font-editorial);
		font-size: 16px;
		color: #000;
		margin: 0;
		line-height: 1.55;
	}

	@media (max-width: 900px) {
		.hero-home {
			margin-bottom: 200px;
		}
	}

	@media (max-width: 600px) {
		.hero-overlay {
			width: calc(100% - 32px);
			max-width: none;
			padding: 24px 22px 28px;
			transform: translate(-50%, 48%);
		}
		.hero-home {
			margin-bottom: 160px;
		}
		.hero-overlay-title {
			font-size: 20px;
		}
		.hero-overlay-author {
			margin-bottom: 14px;
		}
		.hero-overlay-excerpt {
			font-size: 14px;
			line-height: 1.5;
		}
	}

	/* RIGHT: sidebar article — image, badge, heading, serif body */
	.hrc-stack {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
		min-width: 0;
	}
	.hrc-mini-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		height: 100%;
		background: #fff;
		color: inherit;
	}
	.hrc-mini-card:hover .hrc-title {
		color: #333;
	}

	.hrc-img {
		position: relative;
		flex-shrink: 0;
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: #e8e8e8;
	}
	.hrc-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.35s ease;
	}
	.hrc-mini-card:hover .hrc-img img {
		transform: scale(1.03);
	}
	.hrc-ph {
		width: 100%;
		height: 100%;
		background: #e8e8e8;
	}

	.hrc-badge {
		position: absolute;
		bottom: 10px;
		left: 10px;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #fff;
		background: #000;
		padding: 3px 8px;
		border-radius: 0;
		line-height: 1.2;
	}

	.hrc-body {
		flex: 1;
		padding: 20px 0 0;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.hrc-title {
		font-family: "Roboto", sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #1a202c;
		margin: 0 0 18px;
		line-height: 1.3;
		transition: color 0.15s;
	}
	.hrc-excerpt {
		font-family: var(--font-editorial);
		font-size: 15px;
		color: #111;
		margin: 0;
		line-height: 1.6;
	}

	/* ══════════════════════════════════════
	   MOSAIC: o o / O / o o
	   ══════════════════════════════════════ */
	.mosaic-grid {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 4px;
		height: 480px;
	}

	.mosaic-side {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 4px;
	}

	.side-card {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.side-img {
		width: 100%;
		height: 100%;
	}
	.side-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
		opacity: 0.88;
	}
	.side-card:hover .side-img img {
		transform: scale(1.05);
		opacity: 1;
	}

	.side-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 28px 10px 8px;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.78) 0%,
			transparent 100%
		);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}
	.side-title {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #fff;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
	}

	.mosaic-center {
		position: relative;
		display: block;
		overflow: hidden;
		text-decoration: none;
		background: #111;
	}
	.center-img {
		width: 100%;
		height: 100%;
	}
	.center-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}
	.mosaic-center:hover .center-img img {
		transform: scale(1.02);
	}

	.center-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 48px 20px 18px;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.82) 0%,
			rgba(0, 0, 0, 0.2) 60%,
			transparent 100%
		);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}
	.center-title {
		font-family: "Roboto", sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #fff;
		margin: 0;
		line-height: 1.3;
	}
	.center-author {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.75);
		font-family: "Roboto", sans-serif;
	}

	/* ── TABLET (≤900px): stack vertically, hide right cards ── */
	@media (max-width: 900px) {
		.homepage-grid {
			grid-template-columns: 1fr;
			height: auto;
			margin-bottom: 40px;
		}
		.hero-img-link {
			height: 360px;
		}
		/* Hide right-side card stack on tablet/mobile — too cramped */
		.hrc-stack {
			display: none;
		}

		/* Mosaic */
		.mosaic-grid {
			grid-template-columns: 1fr;
			height: auto;
		}
		.mosaic-side {
			grid-template-columns: 1fr 1fr;
		}
		.side-card {
			height: 160px;
		}
		.mosaic-center {
			height: 280px;
			order: -1;
		}
	}
	@media (max-width: 600px) {
		.hero-img-link {
			height: 260px;
		}
		.mosaic-side {
			grid-template-columns: 1fr;
		}
		.side-card {
			height: 140px;
		}
		.mosaic-center {
			height: 220px;
		}
	}
</style>
