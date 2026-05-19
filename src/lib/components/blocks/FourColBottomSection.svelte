<script lang="ts">
	import type { ArticlePreview } from '$lib/types/index.js';
	import { formatGermanShort } from '$lib/utils/date.js';

	interface Props {
		pflanzenschutz: ArticlePreview[];  // Col 1 — 4 items
		produktschau:   ArticlePreview[];  // Col 2 — 4 items
		rasen:          ArticlePreview[];  // Col 3 — 3-4 items
		sidebarProdukt: ArticlePreview[];  // Col 4 — 5 items
	}

	let {
		pflanzenschutz = [],
		produktschau   = [],
		rasen          = [],
		sidebarProdukt = [],
	}: Props = $props();

	// Helper: safe URL builder
	function artUrl(a: ArticlePreview): string {
		return `/${a.urlPath}`;
	}

	// Helper: safe date formatter (handles Date | string from SSR)
	function fmtDate(d: Date | string): string {
		try {
			return formatGermanShort(d);
		} catch {
			return '';
		}
	}
</script>

<!-- ═══════════════════════════════════════════════════════════════════ -->
<!-- SECTIONS 8-11 — 4-COLUMN BOTTOM GRID                               -->
<!-- grid-template-columns: 1fr 1fr 1fr 300px                            -->
<!-- ═══════════════════════════════════════════════════════════════════ -->
<section class="four-col-section" aria-label="Themenbereiche und Produktvorschläge">
	<div class="four-col-grid">

		<!-- ── COLUMN 1: Pflanzenschutz ──────────────────────────────── -->
		<div class="col">
			<div class="col-head">
				<h3 class="col-title">Pflanzenschutz</h3>
				<a href="/category/pflanzenschutz/" class="col-mehr">Mehr →</a>
			</div>

			{#each pflanzenschutz.slice(0, 4) as article, i}
				<article class="mini-card" class:last={i === Math.min(pflanzenschutz.length, 4) - 1}>
					<a href={artUrl(article)} class="mini-thumb" tabindex="-1" aria-hidden="true">
						{#if article.thumbnail}
							<img src={article.thumbnail} alt={article.title} loading="lazy" width="70" height="55" />
						{:else}
							<div class="thumb-ph"></div>
						{/if}
					</a>
					<div class="mini-body">
						<h4 class="mini-title">
							<a href={artUrl(article)}>{article.title}</a>
						</h4>
						<time class="mini-date">{fmtDate(article.publishedAt)}</time>
					</div>
				</article>
			{/each}

			{#if pflanzenschutz.length === 0}
				<p class="col-empty">Keine Artikel verfügbar.</p>
			{/if}
		</div>

		<!-- ── COLUMN 2: Produktschau ─────────────────────────────────── -->
		<div class="col">
			<div class="col-head">
				<h3 class="col-title">Produktschau</h3>
				<a href="/category/produktschau/" class="col-mehr">Mehr →</a>
			</div>

			{#each produktschau.slice(0, 4) as article, i}
				<article class="mini-card" class:last={i === Math.min(produktschau.length, 4) - 1}>
					<a href={artUrl(article)} class="mini-thumb" tabindex="-1" aria-hidden="true">
						{#if article.thumbnail}
							<img src={article.thumbnail} alt={article.title} loading="lazy" width="70" height="55" />
						{:else}
							<div class="thumb-ph"></div>
						{/if}
					</a>
					<div class="mini-body">
						<h4 class="mini-title">
							<a href={artUrl(article)}>{article.title}</a>
						</h4>
						<time class="mini-date">{fmtDate(article.publishedAt)}</time>
					</div>
				</article>
			{/each}

			{#if produktschau.length === 0}
				<p class="col-empty">Keine Artikel verfügbar.</p>
			{/if}
		</div>

		<!-- ── COLUMN 3: Rasen ────────────────────────────────────────── -->
		<div class="col">
			<div class="col-head">
				<h3 class="col-title">Rasen</h3>
				<a href="/category/rasen/" class="col-mehr">Mehr →</a>
			</div>

			{#each rasen.slice(0, 4) as article, i}
				<article class="mini-card" class:last={i === Math.min(rasen.length, 4) - 1}>
					<a href={artUrl(article)} class="mini-thumb" tabindex="-1" aria-hidden="true">
						{#if article.thumbnail}
							<img src={article.thumbnail} alt={article.title} loading="lazy" width="70" height="55" />
						{:else}
							<div class="thumb-ph"></div>
						{/if}
					</a>
					<div class="mini-body">
						<h4 class="mini-title">
							<a href={artUrl(article)}>{article.title}</a>
						</h4>
						<time class="mini-date">{fmtDate(article.publishedAt)}</time>
					</div>
				</article>
			{/each}

			{#if rasen.length === 0}
				<p class="col-empty">Keine Artikel verfügbar.</p>
			{/if}
		</div>

		<!-- ── COLUMN 4: Produktvorschläge (300px sidebar) ────────────── -->
		<div class="col col-sidebar">
			<div class="col-head">
				<h3 class="col-title">Produktvorschläge</h3>
			</div>

			{#each sidebarProdukt.slice(0, 5) as article, i}
				<article class="mini-card" class:last={i === Math.min(sidebarProdukt.length, 5) - 1}>
					<!-- "PRODUKTSCHAU" label per spec -->
					<div class="mini-card-inner">
						<span class="prod-label">PRODUKTSCHAU</span>
						<div class="mini-card-row">
							<a href={artUrl(article)} class="mini-thumb" tabindex="-1" aria-hidden="true">
								{#if article.thumbnail}
									<img src={article.thumbnail} alt={article.title} loading="lazy" width="70" height="55" />
								{:else}
									<div class="thumb-ph"></div>
								{/if}
							</a>
							<div class="mini-body">
								<h4 class="mini-title">
									<a href={artUrl(article)}>{article.title}</a>
								</h4>
								<time class="mini-date">{fmtDate(article.publishedAt)}</time>
							</div>
						</div>
					</div>
				</article>
			{/each}

			{#if sidebarProdukt.length === 0}
				<p class="col-empty">Keine Artikel verfügbar.</p>
			{/if}

			<a href="/category/produktschau/" class="all-link">Alle Produkttests →</a>
		</div>

	</div>
</section>

<style>
	/* ── Section wrapper ─────────────────────────────────────── */
	.four-col-section {
		margin-bottom: 32px;
	}

	/* ── 4-column grid: 1fr 1fr 1fr 300px ───────────────────── */
	.four-col-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 300px;
		gap: 24px;
		align-items: start;
	}

	/* ── Column container ────────────────────────────────────── */
	.col {
		min-width: 0;
	}

	/* ── Column heading row ──────────────────────────────────── */
	.col-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 6px;
		border-bottom: 2px solid var(--color-accent, #F7C900);
		margin-bottom: 4px;
	}

	.col-title {
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-text, #222);
		margin: 0;
	}

	/* "Mehr →" link — right side, purple */
	.col-mehr {
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 12px;
		color: var(--color-primary, #2D1B69);
		text-decoration: none;
		white-space: nowrap;
		transition: opacity 0.15s;
	}
	.col-mehr:hover {
		opacity: 0.75;
	}

	/* ── Mini card — flex row: thumb left + text right ───────── */
	.mini-card {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-border, #E0E0E0);
	}

	/* Last card in each column: no border-bottom */
	.mini-card.last {
		border-bottom: none;
	}

	/* ── Thumbnail: 70×55px ──────────────────────────────────── */
	.mini-thumb {
		flex-shrink: 0;
		width: 70px;
		height: 55px;
		display: block;
		overflow: hidden;
		background: var(--color-border, #E0E0E0);
		text-decoration: none;
	}

	.mini-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.2s ease;
	}

	.mini-card:hover .mini-thumb img {
		transform: scale(1.04);
	}

	/* Gradient placeholder when no thumbnail */
	.thumb-ph {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #e8f4e8 0%, #c8dfc8 100%);
	}

	/* ── Text block right of thumbnail ──────────────────────── */
	.mini-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.mini-title {
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 13px;
		font-weight: 700;
		line-height: 1.3;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.mini-title a {
		color: var(--color-text, #222);
		text-decoration: none;
		transition: color 0.15s;
	}

	.mini-title a:hover {
		color: var(--color-primary, #2D1B69);
	}

	.mini-date {
		font-family: var(--font-body, 'Open Sans', sans-serif);
		font-size: 11px;
		color: var(--color-faint, #999);
		display: block;
	}

	.col-empty {
		font-family: var(--font-body, 'Open Sans', sans-serif);
		font-size: 13px;
		color: var(--color-faint, #999);
		padding: 12px 0;
		margin: 0;
	}

	/* ── Column 4 (sidebar) specific ────────────────────────── */
	/* Each sidebar card has a label above the card row */
	.mini-card-inner {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
		min-width: 0;
	}

	/* Col 4 cards use inner wrapper — reset flex on outer */
	.col-sidebar .mini-card {
		flex-direction: column;
		gap: 0;
	}

	.mini-card-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	/* "PRODUKTSCHAU" label: yellow bg, uppercase, 10px */
	.prod-label {
		display: inline-block;
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 9px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-primary, #2D1B69);
		background: var(--color-accent, #F7C900);
		padding: 1px 5px;
		border-radius: 2px;
		align-self: flex-start;
		margin-bottom: 2px;
	}

	/* "Alle Produkttests →" link — purple, bottom of sidebar col */
	.all-link {
		display: block;
		margin-top: 10px;
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-primary, #2D1B69);
		text-decoration: none;
		transition: opacity 0.15s;
	}
	.all-link:hover {
		opacity: 0.75;
	}

	/* ── Responsive ──────────────────────────────────────────── */
	/* Tablet: 2 columns */
	@media (max-width: 1024px) {
		.four-col-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Mobile: 1 column */
	@media (max-width: 640px) {
		.four-col-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
