<script lang="ts">
	import { page } from '$app/stores';

	interface NavChild { label: string; href: string; }
	interface NavItem  { label: string; href: string; children?: NavChild[]; }

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

	let openMenuMain   = $state<string | null>(null);
	let openMenuSticky = $state<string | null>(null);
	let mobileOpen = $state(false);
	let scrollY    = $state(0);
	let isVisible = $derived(scrollY > 150);

	// Close menus on Escape
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				openMenuMain   = null;
				openMenuSticky = null;
				mobileOpen     = false;
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// Close menus on route change
	$effect(() => {
		$page.url.pathname;
		openMenuMain   = null;
		openMenuSticky = null;
		mobileOpen     = false;
	});

	function isActive(href: string) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href.replace(/\/$/, '') + '/');
	}
</script>

<svelte:window bind:scrollY />

<nav class="site-nav" aria-label="Hauptnavigation">
	<div class="nav-inner">
		<ul class="nav-list" role="menubar">
			{#each navItems as item}
				<li
					class="nav-item"
					class:has-dropdown={!!item.children}
					role="none"
					onmouseenter={() => item.children && (openMenuMain = item.label)}
					onmouseleave={() => (openMenuMain = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						role="menuitem"
						aria-haspopup={item.children ? true : undefined}
						aria-expanded={item.children ? openMenuMain === item.label : undefined}
					>
						{item.label}
						{#if item.children}
							<span class="dropdown-arrow" aria-hidden="true">▾</span>
						{/if}
					</a>

					{#if item.children}
						<div
							class="dropdown"
							class:open={openMenuMain === item.label}
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

<div class="sticky-nav-bar" class:visible={isVisible} aria-hidden={!isVisible}>
	<div class="nav-inner">

		<a href="/" class="logo-link" tabindex={isVisible ? 0 : -1} aria-label="Gartenwoche – Startseite">
			<img
				src="/Logo_Gartenwoche-1.png"
				alt="Gartenwoche"
				class="logo-img"
			/>
		</a>

		<ul class="nav-list" role="menubar">
			{#each navItems as item}
				<li
					class="nav-item"
					class:has-dropdown={!!item.children}
					role="none"
					onmouseenter={() => item.children && (openMenuSticky = item.label)}
					onmouseleave={() => (openMenuSticky = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						role="menuitem"
						tabindex={isVisible ? 0 : -1}
						aria-haspopup={item.children ? true : undefined}
						aria-expanded={item.children ? openMenuSticky === item.label : undefined}
					>
						{item.label}
						{#if item.children}
							<span class="dropdown-arrow" aria-hidden="true">▾</span>
						{/if}
					</a>

					{#if item.children}
						<div
							class="dropdown"
							class:open={openMenuSticky === item.label}
							role="menu"
						>
							{#each item.children as child}
								<a
									href={child.href}
									class="dropdown-item"
									class:active={isActive(child.href)}
									role="menuitem"
									tabindex={isVisible && openMenuSticky === item.label ? 0 : -1}
								>{child.label}</a>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>

{#if mobileOpen}
	<div class="mobile-overlay" onclick={() => (mobileOpen = false)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { mobileOpen = false; e.preventDefault(); } }} role="button" tabindex="0" aria-label="Mobilnavigation schließen"></div>
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
	/* =========================================================================
	   GLOBAL & SHARED NAV STYLES
	   ========================================================================= */
	.nav-list {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		height: 100%;
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
		gap: 4px;
		height: 100%;
		font-family: 'Roboto', 'Open Sans', sans-serif;
		color: #222222;
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 3px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.nav-link:hover {
		color: #222222;
		border-bottom-color: #5a9e3a;
	}
	.nav-link.active {
		color: #5a9e3a;
		border-bottom-color: #5a9e3a;
	}

	.dropdown-arrow {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		line-height: 1;
		color: inherit;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		background: #ffffff;
		border: 1px solid #E0E0E0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
		border-radius: 0 0 4px 4px;
		padding: 8px 0;
		min-width: 210px;
		z-index: 200;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.16s ease, transform 0.16s ease;
	}

	.dropdown.open {
		opacity: 1;
		pointer-events: auto;
	}

	.dropdown-item {
		display: block;
		padding: 8px 20px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #222222;
		text-decoration: none;
		transition: background 0.12s ease, color 0.12s ease;
	}

	.dropdown-item:hover {
		background: #F7F7F7;
		color: #222222;
	}
	.dropdown-item.active {
		background: #F7F7F7;
		color: #5a9e3a;
		font-weight: 600;
	}

	/* =========================================================================
	   1. MAIN STATIC NAV SPECIFICS
	   ========================================================================= */
	.site-nav {
		border-bottom: 6px;
		background: #ffffff;
		z-index: 100;
		width: 100%;
		position: relative;
	}

	.site-nav::after {
		content: '';
		display: block;
		height: 1px;
		background: #E0E0E0;
		margin: 0 auto;
		width: 100%;
		max-width: 1200px;
	}

	.site-nav .nav-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		height: 50px;
	}

	.site-nav .nav-list {
		justify-content: center;
		gap: 32px;
	}

	.site-nav .nav-link {
		font-size: 14px;
		font-weight: 500;
	}

	.site-nav .dropdown {
		left: 50%;
		transform: translateX(-50%) translateY(-4px);
	}

	.site-nav .dropdown.open {
		transform: translateX(-50%) translateY(0);
	}

	.site-nav .dropdown-item {
		text-align: center;
		font-weight: 400;
	}

	/* =========================================================================
	   2. STICKY POP-OUT NAV SPECIFICS
	   ========================================================================= */
	.sticky-nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: #ffffff;
		border-bottom: 1px solid #E0E0E0;
		z-index: 1000;
		transform: translateY(-100%);
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
		pointer-events: none;
	}

	.sticky-nav-bar.visible {
		transform: translateY(0);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
		pointer-events: auto;
	}

	.sticky-nav-bar .nav-inner {
		display: flex;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		height: 64px;
		gap: 32px;
	}

	.sticky-nav-bar .logo-link {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		line-height: 0;
		transition: opacity 0.2s ease;
	}
	.sticky-nav-bar .logo-link:hover { opacity: 0.85; }
	.sticky-nav-bar .logo-img {
		height: 34px;
		width: auto;
		object-fit: contain;
	}

	.sticky-nav-bar .nav-list {
		justify-content: flex-start;
		gap: 28px;
	}

	.sticky-nav-bar .nav-link {
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.3px;
		color: #111111;
	}

	.sticky-nav-bar .dropdown-arrow {
		transform: translateY(1px);
	}

	.sticky-nav-bar .dropdown {
		left: 0;
		border-top: none;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		transform: translateY(-4px);
	}

	.sticky-nav-bar .dropdown.open {
		transform: translateY(0);
	}

	.sticky-nav-bar .dropdown-item {
		text-align: left;
		padding: 10px 20px;
		font-size: 14px;
		font-weight: 500;
		color: #333333;
	}
	.sticky-nav-bar .dropdown-item:hover {
		background: #F8F8F8;
	}
	.sticky-nav-bar .dropdown-item.active {
		background: #F8F8F8;
		color: #5a9e3a;
	}

	/* =========================================================================
	   3. MOBILE PANEL & HAMBURGER STYLES
	   ========================================================================= */
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

	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
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
	@keyframes fadeIn  { from { opacity: 0; }               to { opacity: 1; }            }
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
	.mobile-link:hover { background: #f8f8f8; }
	.mobile-child {
		font-size: 13px;
		font-weight: 400;
		color: #666;
		padding-left: 32px;
	}

	/* =========================================================================
	   4. RESPONSIVE BREAKPOINTS
	   ========================================================================= */
	@media (max-width: 1023px) {
		/* The site-nav sits at fixed top over the header to inject hamburger into header row */
		.site-nav {
			position: fixed;
			top: 0;
			right: 0;
			width: auto;
			height: 64px;
			z-index: 400;
			background: transparent;
			pointer-events: none;
		}
		.site-nav .nav-inner {
			pointer-events: all;
			justify-content: flex-end;
			height: 64px;
			padding: 0 8px;
		}
		/* Hide desktop link list */
		.site-nav .nav-list,
		.sticky-nav-bar {
			display: none;
		}
		.hamburger {
			display: flex;
		}
	}
</style>
