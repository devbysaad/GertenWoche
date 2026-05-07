<script lang="ts">
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';
	import MegaMenu from './MegaMenu.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';

	interface NavChild {
		label: string;
		href: string;
	}

	interface NavItem {
		label: string;
		href: string;
		children?: NavChild[];
	}

	const navItems: NavItem[] = [
		{ label: 'Gartenpraxis', href: '/category/gartenpraxis' },
		{
			label: 'Pflanzen',
			href: '/category/pflanzen',
			children: [
				{ label: 'Stauden', href: '/category/pflanzen/stauden' },
				{ label: 'Sommerflor', href: '/category/pflanzen/sommerflor' },
				{ label: 'Rosen', href: '/category/pflanzen/rosen' },
				{ label: 'Pflanzenempfehlungen', href: '/category/pflanzen/pflanzenempfehlungen' },
				{ label: 'Pflanzenschutz', href: '/category/pflanzenschutz' }
			]
		},
		{ label: 'Rasen', href: '/category/rasen' },
		{ label: 'Wissen', href: '/category/wissen' },
		{
			label: 'Aktuelles',
			href: '/category/aktuelles',
			children: [
				{ label: 'Schweiz', href: '/category/aktuelles/schweiz' },
				{ label: 'Europa', href: '/category/aktuelles/europa' },
				{ label: 'Welt', href: '/category/aktuelles/welt' }
			]
		},
		{ label: 'Gartentechnik', href: '/category/gartentechnik' },
		{ label: 'Podcast Garten', href: '/podcast-garten' }
	];

	let openMenu = $state<string | null>(null);
	let mobileOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 120;
		}
		function onKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				openMenu = null;
				mobileOpen = false;
			}
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('keydown', onKeydown);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKeydown);
		};
	});

	function toggleMenu(label: string) {
		openMenu = openMenu === label ? null : label;
	}

	// Close dropdown when navigating
	$effect(() => {
		$page.url.pathname;
		openMenu = null;
		mobileOpen = false;
	});
</script>

<!-- Sticky nav bar -->
<nav class="nav-primary" aria-label="Hauptnavigation">
	<div class="container nav-inner">
		<!-- Compact logo (visible on scroll) -->
		<div class="nav-logo" class:visible={scrolled}>
			<Logo compact />
		</div>

		<!-- Desktop nav links -->
		<ul class="nav-links" role="menubar">
			{#each navItems as item}
				<li
					class="nav-item"
					class:has-dropdown={item.children}
					role="none"
					onmouseenter={() => item.children && (openMenu = item.label)}
					onmouseleave={() => (openMenu = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={$page.url.pathname.startsWith(item.href)}
						role="menuitem"
						aria-haspopup={item.children ? 'true' : undefined}
						aria-expanded={item.children ? openMenu === item.label : undefined}
					>
						{item.label}
						{#if item.children}
							<svg class="nav-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
								<polyline points="6 9 12 15 18 9" />
							</svg>
						{/if}
					</a>
					{#if item.children}
						<MegaMenu items={item.children} open={openMenu === item.label} />
					{/if}
				</li>
			{/each}
		</ul>

		<!-- Right: search + hamburger -->
		<div class="nav-actions">
			<button
				class="nav-search-btn"
				onclick={() => modalStore.openSearch()}
				aria-label="Suche öffnen"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</button>

			<button
				class="hamburger"
				class:open={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
				aria-expanded={mobileOpen}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>
</nav>

<!-- Mobile slide-in sidebar -->
{#if mobileOpen}
	<!-- Overlay -->
	<div
		class="mobile-overlay"
		role="presentation"
		onclick={() => (mobileOpen = false)}
	></div>

	<!-- Sidebar panel -->
	<div class="mobile-sidebar" role="dialog" aria-label="Mobilnavigation" aria-modal="true">
		<div class="mobile-sidebar-header">
			<Logo compact />
			<button class="mobile-close" onclick={() => (mobileOpen = false)} aria-label="Menü schließen">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<nav class="mobile-nav">
			{#each navItems as item}
				<a href={item.href} class="mobile-nav-link">{item.label}</a>
				{#if item.children}
					{#each item.children as child}
						<a href={child.href} class="mobile-nav-link mobile-nav-child">— {child.label}</a>
					{/each}
				{/if}
			{/each}
		</nav>

		<div class="mobile-auth">
			<button onclick={() => { mobileOpen = false; modalStore.openLogin(); }}>Anmelden</button>
			<button onclick={() => { mobileOpen = false; modalStore.openRegister(); }}>Beitreten</button>
		</div>
	</div>
{/if}

<style>
	.nav-primary {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		height: var(--header-height);
		gap: 8px;
	}

	/* Compact logo */
	.nav-logo {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease;
		flex-shrink: 0;
		margin-right: 16px;
	}

	.nav-logo.visible {
		opacity: 1;
		pointer-events: auto;
	}

	/* Nav links (desktop) */
	.nav-links {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 2px;
		flex: 1;
	}

	.nav-item {
		position: relative;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 12px;
		height: var(--header-height);
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-text);
		text-transform: none;
		white-space: nowrap;
		transition: color 0.2s ease;
		border-bottom: 3px solid transparent;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-accent);
	}

	.nav-chevron {
		transition: transform 0.2s ease;
	}

	.has-dropdown:hover .nav-chevron {
		transform: rotate(180deg);
	}

	/* Right actions */
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
		flex-shrink: 0;
	}

	.nav-search-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.nav-search-btn:hover {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #fff;
	}

	/* Hamburger */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		padding: 6px;
		transition: all 0.2s ease;
	}

	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background: var(--color-text);
		border-radius: 2px;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.hamburger.open span:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger.open span:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Mobile overlay */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 200;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Mobile sidebar */
	.mobile-sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100dvh;
		width: min(320px, 85vw);
		background: var(--color-surface);
		z-index: 201;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		animation: slideIn 0.3s ease;
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
	}

	@keyframes slideIn {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
	}

	.mobile-sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--color-border);
	}

	.mobile-close {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		padding: 4px;
		border-radius: var(--radius-sm);
	}

	.mobile-close:hover {
		background: var(--color-bg);
		color: var(--color-text);
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		padding: 12px 0;
		flex: 1;
	}

	.mobile-nav-link {
		display: block;
		padding: 11px 20px;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-text);
		border-bottom: 1px solid var(--color-border);
		transition: all 0.15s ease;
	}

	.mobile-nav-link:hover {
		color: var(--color-primary);
		background: var(--color-bg);
		padding-left: 24px;
	}

	.mobile-nav-child {
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text-muted);
		padding-left: 28px;
	}

	.mobile-nav-child:hover {
		padding-left: 32px;
	}

	.mobile-auth {
		display: flex;
		gap: 10px;
		padding: 16px 20px;
		border-top: 1px solid var(--color-border);
	}

	.mobile-auth button {
		flex: 1;
		padding: 10px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mobile-auth button:first-child {
		background: var(--color-primary);
		color: #fff;
		border: none;
	}

	.mobile-auth button:first-child:hover {
		background: var(--color-primary-hover);
	}

	.mobile-auth button:last-child {
		background: none;
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
	}

	.mobile-auth button:last-child:hover {
		background: var(--color-primary);
		color: #fff;
	}

	/* Responsive */
	@media (max-width: 1023px) {
		.nav-links {
			display: none;
		}

		.hamburger {
			display: flex;
		}
	}
</style>
