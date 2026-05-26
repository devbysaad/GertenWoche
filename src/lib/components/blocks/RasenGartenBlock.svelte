<script lang="ts">
	/**
	 * Curated 3-Column Rasen & Garten block for the Homepage
	 * Column 1: "Neue Hortensie – Runaway Bride" feature + 2 stacked small cards
	 * Column 2: "Der Steppensalbei – Salvia nemorosa" feature + 2 stacked small cards
	 * Column 3: Premium light-green sidebar block containing 6 articles and "Mehr entdecken" tags
	 */

	let { blockData } = $props();

	const col1Main = $derived(blockData?.col1Main);
	const col1Stacked = $derived(blockData?.col1Stacked ?? []);
	const col2Main = $derived(blockData?.col2Main);
	const col2Stacked = $derived(blockData?.col2Stacked ?? []);
	const sidebarList = $derived(blockData?.sidebarList ?? []);

	const tags = [
		{ name: 'Ausstellungen und Tagungen', path: '/search?q=Ausstellungen%20und%20Tagungen' },
		{ name: 'Hortensie', path: '/search?q=Hortensie' },
		{ name: 'Gewächshaus', path: '/search?q=Gew%C3%A4chshaus' },
		{ name: 'Hof, Veranda, Garten und Rasen', path: '/search?q=Hof,%20Veranda,%20Garten%20und%20Rasen' },
		{ name: 'Gewächshäuser', path: '/search?q=Gew%C3%A4chsh%C3%A4user' },
		{ name: 'Sträucher & Büsche', path: '/search?q=Str%C3%A4ucher%20%26%20B%C3%BCsche' },
		{ name: 'Rasen', path: '/search?q=Rasen' }
	];
</script>

<section class="rasen-block">
	<div class="rasen-inner">
		<!-- ── COLUMN 1 (LEFT) ── -->
		<div class="rasen-col">
			{#if col1Main}
				<div class="jk-main-card">
					<a href="/{col1Main.urlPath}" class="jk-image-link">
						<div class="jk-image-wrapper">
							<img src={col1Main.thumbnail} alt={col1Main.title} loading="lazy" />
							<span class="jk-image-badge">{col1Main.category.name}</span>
						</div>
					</a>
					<a href="/{col1Main.urlPath}" class="jk-title-link">
						<h3 class="jk-main-title">{col1Main.title}</h3>
					</a>
					<div class="jk-main-author">{col1Main.author.name}</div>
					<p class="jk-main-excerpt">{col1Main.excerpt}</p>
				</div>
			{/if}
		</div>

		<!-- ── COLUMN 2 (MIDDLE) ── -->
		<div class="rasen-col">
			{#if col2Main}
				<div class="jk-main-card">
					<a href="/{col2Main.urlPath}" class="jk-image-link">
						<div class="jk-image-wrapper">
							<img src={col2Main.thumbnail} alt={col2Main.title} loading="lazy" />
							<span class="jk-image-badge">{col2Main.category.name}</span>
						</div>
					</a>
					<a href="/{col2Main.urlPath}" class="jk-title-link">
						<h3 class="jk-main-title">{col2Main.title}</h3>
					</a>
					<div class="jk-main-author">{col2Main.author.name}</div>
					<p class="jk-main-excerpt">{col2Main.excerpt}</p>
				</div>
			{/if}
		</div>

		<!-- ── COLUMN 3 (RIGHT SIDEBAR) ── -->
		<div class="rasen-sidebar-col">
			<div class="jk-sidebar-green">
				<div class="jk-sidebar-list">
					{#each sidebarList as item}
						<div class="jk-sidebar-item">
							<span class="jk-sidebar-cat">{item.category.name}</span>
							<div class="jk-sidebar-title-row">
								{#if item.showGwIcon}
									<span class="jk-gw-icon">G+</span>
								{/if}
								<a href="/{item.urlPath}" class="jk-sidebar-title">
									{item.title}
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- ── COLUMN 1 STACKED ── -->
		<div class="jk-stacked-list">
			{#each col1Stacked as item}
				<a href="/{item.urlPath}" class="jk-stacked-item">
					<div class="jk-stacked-thumb">
						<img src={item.thumbnail} alt={item.title} loading="lazy" />
					</div>
					<h4 class="jk-stacked-title">{item.title}</h4>
				</a>
			{/each}
		</div>

		<!-- ── COLUMN 2 STACKED ── -->
		<div class="jk-stacked-list">
			{#each col2Stacked as item}
				<a href="/{item.urlPath}" class="jk-stacked-item">
					<div class="jk-stacked-thumb">
						<img src={item.thumbnail} alt={item.title} loading="lazy" />
					</div>
					<h4 class="jk-stacked-title">{item.title}</h4>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.rasen-block {
		margin-bottom: 48px;
	}

	.rasen-inner {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 28px;
		align-items: start;
	}

	.rasen-col {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Large main cards styling */
	.jk-main-card {
		display: flex;
		flex-direction: column;
	}

	.jk-image-link {
		display: block;
		width: 100%;
		border-radius: 3px;
		overflow: hidden;
	}

	.jk-image-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 10;
		background: #f0f0f0;
		overflow: hidden;
	}

	.jk-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.jk-image-wrapper:hover img {
		transform: scale(1.04);
	}

	.jk-image-badge {
		position: absolute;
		bottom: 8px;
		left: 8px;
		background: #1a1a1a;
		color: #ffffff;
		padding: 3px 8px;
		font-family: var(--font-body), sans-serif;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border-radius: 2px;
	}

	.jk-title-link {
		text-decoration: none;
	}

	.jk-main-title {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: clamp(16px, 1.8vw, 19px);
		font-weight: 700;
		line-height: 1.3;
		color: #111111;
		margin: 12px 0 4px;
		transition: color 0.2s;
	}

	.jk-main-title:hover {
		color: #006633;
	}

	.jk-main-author {
		font-family: var(--font-body), sans-serif;
		font-size: 11px;
		font-weight: 700;
		color: #888888;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.jk-main-excerpt {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 13px;
		line-height: 1.5;
		color: #444444;
		margin: 0;
	}

	/* Stacked small cards styling */
	.jk-stacked-list {
		display: flex;
		flex-direction: column;
	}

	.jk-stacked-item {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid #eeeeee;
		text-decoration: none;
		transition: background-color 0.2s;
	}

	.jk-stacked-item:last-child {
		border-bottom: none;
	}

	.jk-stacked-thumb {
		width: 72px;
		height: 48px;
		overflow: hidden;
		flex-shrink: 0;
		background: #f0f0f0;
		border-radius: 2px;
	}

	.jk-stacked-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.jk-stacked-title {
		font-family: var(--td_default_google_font_1), Georgia, serif;
		font-size: 13px;
		font-weight: 700;
		line-height: 1.35;
		color: #222222;
		margin: 0;
		transition: color 0.2s;
	}

	.jk-stacked-item:hover .jk-stacked-title {
		color: #006633;
	}

	/* Sidebar styling */
	.rasen-sidebar-col {
		grid-row: span 2;
	}

	.jk-sidebar-green {
		background: #ecf5f1;
		border: 1px solid #d5e6df;
		border-radius: 6px;
		padding: 34px 24px;
		box-shadow: 0 10px 30px rgba(12, 43, 48, 0.05), 0 2px 6px rgba(12, 43, 48, 0.02);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.jk-sidebar-green:hover {
		box-shadow: 0 16px 36px rgba(12, 43, 48, 0.08), 0 4px 10px rgba(12, 43, 48, 0.03);
	}

	.jk-sidebar-list {
		display: flex;
		flex-direction: column;
	}

	.jk-sidebar-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 19px 0;
		border-bottom: none;
	}

	.jk-sidebar-item:first-child {
		padding-top: 0;
	}

	.jk-sidebar-item:last-child {
		padding-bottom: 0;
	}

	.jk-sidebar-cat {
		font-family: var(--font-body), sans-serif;
		font-size: 10px;
		font-weight: 700;
		color: #3b7b5d;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.jk-sidebar-title-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.jk-gw-icon {
		background: #2db34a;
		color: #ffffff;
		font-family: var(--font-body), sans-serif;
		font-size: 10px;
		font-weight: 800;
		padding: 2px 5px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 3px;
		line-height: 1;
	}

	.jk-sidebar-title {
		font-family: var(--font-heading), sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #0c2b30;
		line-height: 1.4;
		text-decoration: none;
		transition: color 0.2s;
	}

	.jk-sidebar-title:hover {
		color: #006633;
	}

	/* Responsive design */
	@media (max-width: 1023px) {
		.rasen-inner {
			grid-template-columns: 1fr 1fr;
			gap: 20px;
		}

		.rasen-sidebar-col {
			grid-column: span 2;
			grid-row: span 1;
		}
	}

	@media (max-width: 640px) {
		.rasen-inner {
			grid-template-columns: 1fr;
		}

		.rasen-sidebar-col {
			grid-column: span 1;
		}
	}
</style>
