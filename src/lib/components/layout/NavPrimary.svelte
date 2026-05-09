<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	interface NavChild { label: string; href: string; }
	interface NavItem  { label: string; href: string; children?: NavChild[]; }

	// Spec: exact order
	const navItems: NavItem[] = [
		{ label: 'Gartenpraxis', href: '/category/gartenpraxis/' },
		{
			label: 'Pflanzen', href: '/category/pflanzen/',
			children: [
				{ label: 'Stauden',                href: '/category/pflanzen/stauden/' },
				{ label: 'Sommerflor',             href: '/category/pflanzen/sommerflor/' },
				{ label: 'Rosen',                  href: '/category/pflanzen/rosen/' },
				{ label: 'Pflanzenempfehlungen',   href: '/category/pflanzen/pflanzenempfehlungen/' },
				{ label: 'Pflanzenschutz',         href: '/category/pflanzenschutz/' },
			]
		},
		{ label: 'Rasen',         href: '/category/rasen/' },
		{ label: 'Wissen',        href: '/category/wissen/' },
		{
			label: 'Aktuelles', href: '/category/aktuelles/',
			children: [
				{ label: 'Schweiz', href: '/category/aktuelles/schweiz/' },
				{ label: 'Europa',  href: '/category/aktuelles/europa/' },
				{ label: 'Welt',    href: '/category/aktuelles/welt/' },
			]
		},
		{ label: 'Gartentechnik', href: '/category/gartentechnik/' },
		{ label: 'Podcast Garten', href: '/podcast-garten/' },
	];

	// ── Nav dropdown state ──────────────────────────────────────
	let openMenu   = $state<string | null>(null);
	let mobileOpen = $state(false);

	// ── Search popup state ──────────────────────────────────────
	let searchOpen    = $state(false);
	let searchQuery   = $state('');
	let searchResults = $state<Array<{ title: string; href: string; category: string }>>([]);
	let searchWrap: HTMLDivElement | undefined;
	let searchInput: HTMLInputElement | undefined;

	// Close on route change or Escape
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				openMenu   = null;
				mobileOpen = false;
				searchOpen = false;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// Click outside search → close
	$effect(() => {
		if (!searchOpen) return;
		function onOutside(e: MouseEvent) {
			if (searchWrap && !searchWrap.contains(e.target as Node)) {
				searchOpen  = false;
				searchQuery = '';
			}
		}
		document.addEventListener('mousedown', onOutside);
		return () => document.removeEventListener('mousedown', onOutside);
	});

	// Focus input when popup opens
	$effect(() => {
		if (searchOpen && searchInput) {
			setTimeout(() => searchInput?.focus(), 50);
		}
	});

	$effect(() => {
		$page.url.pathname;
		openMenu   = null;
		mobileOpen = false;
		searchOpen = false;
	});

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href.replace(/\/$/, '') + '/');
	}

	// Live search — debounced fetch from WP API
	let debounce: ReturnType<typeof setTimeout>;
	function onSearchInput() {
		clearTimeout(debounce);
		if (!searchQuery.trim()) { searchResults = []; return; }
		debounce = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://gartenwoche.ch/wp-json/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=5&_embed`,
					{ signal: AbortSignal.timeout(4000) }
				);
				if (!res.ok) { searchResults = []; return; }
				const posts = await res.json();
				searchResults = posts.map((p: Record<string, unknown>) => ({
					title:    (p.title as Record<string, string>)?.rendered?.replace(/<[^>]+>/g, '') ?? '',
					href:     (p.link as string)?.replace('https://gartenwoche.ch', '') ?? '/',
					category: ((p._embedded as Record<string, unknown>)?.['wp:term'] as unknown[])?.[0] as string ?? ''
				}));
			} catch { searchResults = []; }
		}, 280);
	}

	function submitSearch() {
		const q = searchQuery.trim();
		if (q) goto(`/search?q=${encodeURIComponent(q)}`);
		searchOpen  = false;
		searchQuery = '';
	}

	function toggleSearch() {
		searchOpen  = !searchOpen;
		if (!searchOpen) { searchQuery = ''; searchResults = []; }
	}
</script>

<!-- ──────────────────────────────────────────────────────────
     NAV — white, 50px, sticky top:0, border-bottom #E0E0E0
     ────────────────────────────────────────────────────────── -->
<nav class="site-nav" aria-label="Hauptnavigation">
	<div class="nav-inner">

		<!-- Desktop nav links (left) -->
		<ul class="nav-list" role="menubar">
			{#each navItems as item}
				<li
					class="nav-item"
					class:has-dropdown={!!item.children}
					role="none"
					onmouseenter={() => item.children && (openMenu = item.label)}
					onmouseleave={() => (openMenu = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						role="menuitem"
						aria-haspopup={item.children ? 'true' : undefined}
						aria-expanded={item.children ? String(openMenu === item.label) : undefined}
					>
						{item.label}
						{#if item.children}
							<span class="dropdown-arrow" aria-hidden="true">▾</span>
						{/if}
					</a>

					{#if item.children}
						<div
							class="dropdown"
							class:open={openMenu === item.label}
							role="menu"
						>
							{#each item.children as child}
								<a
									href={child.href}
									class="dropdown-item"
									class:active={isActive(child.href)}
									role="menuitem"
								>{child.label}</a>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		<!-- ── Search icon + inline popup ───────────────────────── -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="search-wrap" bind:this={searchWrap}>
			<button
				class="search-btn"
				type="button"
				onclick={toggleSearch}
				aria-label={searchOpen ? 'Suche schließen' : 'Suche öffnen'}
				aria-expanded={searchOpen}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
					<circle cx="11" cy="11" r="8"/>
					<line x1="21" y1="21" x2="16.65" y2="16.65"/>
				</svg>
			</button>

			{#if searchOpen}
				<!-- Dropdown popup — 320px, anchored to search button -->
				<div class="search-popup" role="dialog" aria-label="Suche">
					<!-- Input row -->
					<form class="search-row" onsubmit={(e) => { e.preventDefault(); submitSearch(); }}>
						<input
							bind:this={searchInput}
							bind:value={searchQuery}
							oninput={onSearchInput}
							type="search"
							class="search-input"
							placeholder="type here..."
							autocomplete="off"
						/>
						<button type="submit" class="search-go">Suche →</button>
					</form>

					<!-- Live results (up to 5) -->
					{#if searchResults.length > 0}
						<ul class="search-results">
							{#each searchResults as result}
								<li>
									<a
										href={result.href}
										class="search-result-link"
										onclick={() => { searchOpen = false; searchQuery = ''; }}
									>
										<span class="result-title">{result.title}</span>
									</a>
								</li>
							{/each}
						</ul>
					{:else if searchQuery.trim().length > 1}
						<p class="search-empty">Keine Ergebnisse gefunden.</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Hamburger (mobile, <1024px) -->
		<button
			class="hamburger"
			class:open={mobileOpen}
			type="button"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
			aria-expanded={mobileOpen}
		>
			<span></span><span></span><span></span>
		</button>

	</div>
</nav>

<!-- Mobile slide-in panel (from LEFT per spec) -->
{#if mobileOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mobile-overlay" onclick={() => (mobileOpen = false)}></div>
	<div class="mobile-panel" role="dialog" aria-label="Mobilnavigation" aria-modal="true">
		<div class="mobile-top">
			<span class="mobile-brand">Gartenwoche</span>
			<button class="mobile-close" type="button" onclick={() => (mobileOpen = false)} aria-label="Schließen">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			</button>
		</div>
		<nav class="mobile-nav">
			{#each navItems as item}
				<a href={item.href} class="mobile-link">{item.label}</a>
				{#if item.children}
					{#each item.children as child}
						<a href={child.href} class="mobile-link mobile-child">— {child.label}</a>
					{/each}
				{/if}
			{/each}
		</nav>
	</div>
{/if}

<style>
	/* ── Nav shell ──────────────────────────────────────────────── */
	.site-nav {
		background: #ffffff;
		border-bottom: 1px solid #E0E0E0;
		position: sticky;
		top: 0;
		z-index: 100;
		width: 100%;
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		height: 50px;
	}

	/* ── Nav links ──────────────────────────────────────────────── */
	.nav-list {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 28px;
		height: 100%;
		flex: 1;
	}

	.nav-item {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 2px;
		height: 100%;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #222222;
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 3px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}
	.nav-link:hover,
	.nav-link.active {
		color: #2D1B69;
		border-bottom-color: #F7C900;
	}

	.dropdown-arrow {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		line-height: 1;
		color: inherit;
	}

	/* ── Dropdown panel ─────────────────────────────────────────── */
	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background: #ffffff;
		border: 1px solid #E0E0E0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
		border-radius: 0 0 4px 4px;
		padding: 8px 0;
		min-width: 210px;
		z-index: 200;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition: opacity 0.16s ease, transform 0.16s ease;
	}
	.dropdown.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.dropdown-item {
		display: block;
		padding: 8px 20px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 400;
		color: #222222;
		text-decoration: none;
		transition: background 0.12s ease, color 0.12s ease;
	}
	.dropdown-item:hover,
	.dropdown-item.active {
		background: #F7F7F7;
		color: #2D1B69;
	}

	/* ── Search: icon button + popup ───────────────────────────── */
	.search-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: #333333;
		cursor: pointer;
		padding: 6px;
		border-radius: 4px;
		transition: color 0.15s ease;
	}
	.search-btn:hover { color: #2D1B69; }

	/* Popup: 320px max, white, anchored top-right of nav */
	.search-popup {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: 320px;
		max-width: calc(100vw - 40px);
		background: #ffffff;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 300;
		overflow: hidden;
	}

	/* Input row */
	.search-row {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f0f0f0;
	}

	.search-input {
		flex: 1;
		padding: 10px 12px;
		border: none;
		outline: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #222;
		background: transparent;
		min-width: 0;
	}
	.search-input::placeholder { color: #aaa; }

	.search-go {
		flex-shrink: 0;
		padding: 10px 12px;
		background: none;
		border: none;
		border-left: 1px solid #f0f0f0;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: #2D1B69;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s;
	}
	.search-go:hover { background: #f7f7f7; }

	/* Live results list */
	.search-results {
		list-style: none;
		margin: 0;
		padding: 4px 0;
	}

	.search-result-link {
		display: block;
		padding: 8px 14px;
		text-decoration: none;
		transition: background 0.12s;
	}
	.search-result-link:hover { background: #f7f7f7; }

	.result-title {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #222;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.search-empty {
		padding: 10px 14px;
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #999;
		margin: 0;
	}

	/* ── Hamburger ──────────────────────────────────────────────── */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 7px;
		flex-shrink: 0;
	}
	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background: #333;
		border-radius: 2px;
		transition: all 0.25s ease;
		transform-origin: center;
	}
	.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
	.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
	.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

	/* ── Mobile panel ───────────────────────────────────────────── */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		z-index: 200;
		animation: fadeIn 0.2s ease;
	}
	.mobile-panel {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		width: min(300px, 85vw);
		background: #fff;
		z-index: 201;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		animation: slideIn 0.26s ease;
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
	}
	@keyframes fadeIn  { from { opacity: 0; }               to { opacity: 1; }           }
	@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

	.mobile-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 18px;
		border-bottom: 1px solid #e0e0e0;
	}
	.mobile-brand {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		font-size: 20px;
		color: #222;
	}
	.mobile-close {
		background: none;
		border: none;
		cursor: pointer;
		color: #777;
		display: flex;
		align-items: center;
		padding: 4px;
	}
	.mobile-close:hover { color: #222; }

	.mobile-nav {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.mobile-link {
		display: block;
		padding: 11px 18px;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #222;
		border-bottom: 1px solid #f0f0f0;
		text-decoration: none;
		transition: color 0.15s, background 0.15s;
	}
	.mobile-link:hover { color: #2D1B69; background: #f8f8f8; }
	.mobile-child {
		font-size: 13px;
		font-weight: 400;
		color: #666;
		padding-left: 32px;
	}

	/* ── Responsive ─────────────────────────────────────────────── */
	@media (max-width: 1023px) {
		.nav-list   { display: none; }
		.search-btn { display: none; }
		.hamburger  { display: flex; }
	}
</style>
