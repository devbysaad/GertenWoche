<script lang="ts">
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
				<!-- Dark gradient + article info overlaid at bottom -->
				<div class="hero-overlay">
					<span class="hero-overlay-badge"
						>{article.category.name}</span
					>
					<p class="hero-overlay-title">{article.title}</p>
					{#if article.excerpt}
						<p class="hero-overlay-excerpt">{article.excerpt}</p>
					{/if}
					<span class="hero-overlay-author"
						>{article.author.name}</span
					>
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
							<span class="hrc-author">{art.author.name}</span>
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
		margin-bottom: 130px; /* Space for hanging overlay */
	}

	/* ── Category badge (mosaic shared) ── */
	.cat-badge {
		display: inline-block;
		background: rgba(0, 0, 0, 0.65);
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
		grid-template-columns: 65% 35%;
		gap: 3px;
		height: 500px;
		max-height: 500px;
		background: #e0e0e0;
		border: 1px solid #e0e0e0;
		overflow: visible; /* Allowing the overlay to hang out */
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

	/* Hanging box centered at mid-bottom of image — visible on desktop */
	.hero-overlay {
		position: absolute;
		bottom: 0;
		left: 50% !important;
		transform: translate(-50%, 50%) !important;
		width: 88%;
		max-width: 620px;
		background: #f4f4f4 !important;
		padding: 24px 24px 36px; /* Optimized bottom padding */
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-radius: 4px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
		z-index: 10 !important;
		pointer-events: auto;
	}

	@media (max-width: 600px) {
		.hero-overlay {
			width: 90%;
			padding: 14px 16px;
			gap: 0;
			bottom: -20px; /* Hanging 20px out */
			transform: translateX(-50%) !important;
		}
		.hero-overlay-title {
			font-size: 18px !important;
			line-height: 1.2 !important;
			-webkit-line-clamp: 3 !important;
			line-clamp: 3 !important;
		}
		/* Hide description and author on small mobile per request */
		.hero-overlay-excerpt,
		.hero-overlay-author,
		.hero-overlay-badge {
			display: none !important;
		}
	}
	.hero-overlay-badge {
		display: inline-block;
		align-self: flex-start;
		background: #5a9e3a;
		color: #fff;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 2px 8px;
		border-radius: 2px;
	}
	.hero-overlay-title {
		font-family: "Roboto", sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #111;
		margin: 0;
		line-height: 1.2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
	}
	.hero-overlay-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #444;
		margin: 0;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-clamp: 2;
		overflow: hidden;
	}
	.hero-overlay-author {
		font-family: "Open Sans", sans-serif;
		font-size: 11px;
		color: #666;
		margin-top: 4px;
		font-weight: 700;
	}
	/* RIGHT STACK: 2 mini cards stacked with gap */
	.hrc-stack {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #fff;
	}
	.hrc-mini-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		overflow: hidden;
		flex: 0 0 auto; /* Don't stretch if only one */
		background: #fff;
		transition: background 0.15s;
		border-bottom: 1px solid #eee;
	}
	.hrc-mini-card:last-child {
		border-bottom: none;
	}
	.hrc-mini-card:hover {
		background: #fafafa;
	}

	/* Image portion - shrunk to 40% to ensure 2 items fit */
	.hrc-img {
		position: relative;
		flex: 0 0 38%;
		overflow: hidden;
		background: #e0e0e0;
	}
	.hrc-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}
	.hrc-mini-card:hover .hrc-img img {
		transform: scale(1.04);
	}
	.hrc-ph {
		width: 100%;
		height: 100%;
		background: #e0e0e0;
	}

	/* Badge: category label on image — dark neutral, no green */
	.hrc-badge {
		position: absolute;
		bottom: 8px;
		left: 10px;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #fff;
		background: rgba(0, 0, 0, 0.55);
		padding: 2px 7px;
		border-radius: 2px;
	}

	/* Body: title + excerpt + author */
	.hrc-body {
		flex: 1;
		padding: 14px 16px 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		overflow: hidden;
	}
	.hrc-title {
		font-family: "Roboto", sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		line-clamp: 4;
		overflow: hidden;
		transition: color 0.15s;
	}
	.hrc-mini-card:hover .hrc-title {
		color: #444;
	}
	.hrc-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #555 !important;
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 6; /* More lines since there is more room now */
		-webkit-box-orient: vertical;
		line-clamp: 6;
		overflow: hidden;
	}
	.hrc-author {
		font-family: "Open Sans", sans-serif;
		font-size: 11px;
		color: #999;
		margin-top: auto;
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
