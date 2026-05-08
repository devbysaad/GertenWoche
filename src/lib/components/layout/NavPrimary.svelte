<script lang="ts">
	import { page } from '$app/stores';
	import { modalStore } from '$lib/stores/modal.store.js';

	interface NavChild { label: string; href: string; }
	interface NavItem  { label: string; href: string; children?: NavChild[]; }

	// Spec: exact order — Gartenpraxis | Pflanzen ▾ | Rasen | Wissen | Aktuelles ▾ | Gartentechnik | Podcast Garten
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

	// Track which dropdown is open
	let openMenu = $state<string | null>(null);
	let mobileOpen = $state(false);

	// Close on route change or Escape
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') { openMenu = null; mobileOpen = false; }
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		$page.url.pathname;
		openMenu = null;
		mobileOpen = false;
	});

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href.replace(/\/$/, '') + '/');
	}
</script>

<!-- ──────────────────────────────────────────────────────────
     NAV — white, 50px, sticky top:0, border-bottom #E0E0E0
     NO logo inside nav (logo lives in HeaderMain)
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
							<!-- spec: ▾ indicator, Roboto 12px same colour as link -->
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

		<!-- Search icon (right only, spec: 20px SVG, colour #333) -->
		<button
			class="search-btn"
			type="button"
			onclick={() => modalStore.openSearch()}
			aria-label="Suche öffnen"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
				<circle cx="11" cy="11" r="8"/>
				<line x1="21" y1="21" x2="16.65" y2="16.65"/>
			</svg>
		</button>

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
	/* ── Nav shell ────────────────────────────────────────────────
	   Spec: white, height 50px, sticky top:0, z-index 100,
	         border-bottom 1px solid #E0E0E0
	   ─────────────────────────────────────────────────────────── */
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

	/* ── Nav links ───────────────────────────────────────────────
	   Spec: Roboto 14px weight 500, colour #222, hover #2D1B69,
	         gap 28px between items
	   ─────────────────────────────────────────────────────────── */
	.nav-list {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 28px;       /* spec: exactly 28px between items */
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
		font-weight: 500;   /* spec: 500 */
		color: #222222;     /* spec: #222 */
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 3px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.nav-link:hover,
	.nav-link.active {
		color: #2D1B69;   /* spec: hover #2D1B69 */
		border-bottom-color: #F7C900;
	}

	/* ▾ indicator — spec: Roboto 12px, same colour as link */
	.dropdown-arrow {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		line-height: 1;
		color: inherit;
	}

	/* ── Dropdown panel ──────────────────────────────────────────
	   Spec: bg #fff, border 1px #E0E0E0,
	         box-shadow 0 4px 12px rgba(0,0,0,0.1),
	         border-radius 0 0 4px 4px, padding 8px 0
	         Items: padding 8px 20px, Roboto 13px, hover bg #F7F7F7
	   ─────────────────────────────────────────────────────────── */
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
		padding: 8px 20px;   /* spec exactly */
		font-family: 'Roboto', sans-serif;
		font-size: 13px;     /* spec exactly */
		font-weight: 400;
		color: #222222;
		text-decoration: none;
		transition: background 0.12s ease, color 0.12s ease;
	}

	.dropdown-item:hover,
	.dropdown-item.active {
		background: #F7F7F7;  /* spec exactly */
		color: #2D1B69;
	}

	/* ── Search button (right side) ──────────────────────────────
	   Spec: SVG 20px, colour #333, click → search overlay
	   ─────────────────────────────────────────────────────────── */
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
		flex-shrink: 0;
		transition: color 0.15s ease;
	}

	.search-btn:hover { color: #2D1B69; }

	/* ── Hamburger (mobile, hidden on desktop) ─────────────────── */
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

	/* ── Mobile panel ────────────────────────────────────────────
	   Spec: slide-in from LEFT
	   ─────────────────────────────────────────────────────────── */
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

	@keyframes fadeIn  { from { opacity: 0; }           to { opacity: 1; }          }
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

	/* ── Responsive ──────────────────────────────────────────────
	   Spec mobile <1024px: hamburger replaces nav links
	   ─────────────────────────────────────────────────────────── */
	@media (max-width: 1023px) {
		.nav-list  { display: none; }
		.search-btn { display: none; }
		.hamburger  { display: flex; }
	}
</style>
