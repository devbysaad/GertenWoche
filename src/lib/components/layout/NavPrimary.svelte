<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { mobileMenuOpen, searchOpen } from "$lib/stores/nav.store.js";

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
		{ label: "Gartenpraxis", href: "/category/gartenpraxis/" },
		{
			label: "Pflanzen",
			href: "/category/pflanzen/",
			children: [
				{ label: "Stauden", href: "/category/pflanzen/stauden/" },
				{ label: "Sommerflor", href: "/category/pflanzen/sommerflor/" },
				{ label: "Rosen", href: "/category/pflanzen/rosen/" },
				{
					label: "Pflanzenempfehlungen",
					href: "/category/pflanzen/pflanzenempfehlungen/",
				},
				{ label: "Pflanzenschutz", href: "/category/pflanzenschutz/" },
			],
		},
		{ label: "Rasen", href: "/category/rasen/" },
		{ label: "Wissen", href: "/category/wissen/" },
		{
			label: "Aktuelles",
			href: "/category/aktuelles/",
			children: [
				{ label: "Schweiz", href: "/category/aktuelles/schweiz/" },
				{ label: "Europa", href: "/category/aktuelles/europa/" },
				{ label: "Welt", href: "/category/aktuelles/welt/" },
			],
		},
		{ label: "Gartentechnik", href: "/category/gartentechnik/" },
		{ label: "Podcast Garten", href: "/podcast-garten/" },
	];

	let openMenuMain = $state<string | null>(null);
	let openMenuSticky = $state<string | null>(null);
	let scrollY = $state(0);
	let isVisible = $derived(scrollY > 150);

	// Close menus on Escape
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") {
				openMenuMain = null;
				openMenuSticky = null;
				mobileMenuOpen.set(false);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	// Close menus on route change
	$effect(() => {
		$page.url.pathname;
		openMenuMain = null;
		openMenuSticky = null;
		mobileMenuOpen.set(false);
	});

	function isActive(href: string) {
		return (
			$page.url.pathname === href ||
			$page.url.pathname.startsWith(href.replace(/\/$/, "") + "/")
		);
	}
</script>

<svelte:window bind:scrollY />

{#if $mobileMenuOpen}
	<div
		class="mobile-overlay"
		onclick={() => ($mobileMenuOpen = false)}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				$mobileMenuOpen = false;
				e.preventDefault();
			}
		}}
		role="button"
		tabindex="0"
		aria-label="Mobilnavigation schließen"
	></div>
	<div
		class="mobile-panel"
		role="dialog"
		aria-label="Mobilnavigation"
		aria-modal="true"
	>
		<div class="mobile-top">
			<span class="mobile-brand">Gartenwoche</span>
			<button
				class="mobile-close"
				type="button"
				onclick={() => ($mobileMenuOpen = false)}
				aria-label="Schließen"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="2.5"
				>
					<line x1="18" y1="6" x2="6" y2="18" /><line
						x1="6"
						y1="6"
						x2="18"
						y2="18"
					/>
				</svg>
			</button>
		</div>
		<nav class="mobile-nav">
			{#each navItems as item}
				<div class="mobile-item-group">
					<a
						href={item.href}
						class="mobile-link"
						onclick={() => ($mobileMenuOpen = false)}
						>{item.label}</a
					>
					{#if item.children}
						<div class="mobile-children">
							{#each item.children as child}
								<a
									href={child.href}
									class="mobile-link mobile-child"
									onclick={() => ($mobileMenuOpen = false)}
									>{child.label}</a
								>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>
	</div>
{/if}

<nav class="site-nav" aria-label="Hauptnavigation">
	<div class="nav-inner">
		<ul class="nav-list" role="menubar">
			{#each navItems as item}
				<li
					class="nav-item"
					class:has-dropdown={!!item.children}
					role="none"
					onmouseenter={() =>
						item.children && (openMenuMain = item.label)}
					onmouseleave={() => (openMenuMain = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						role="menuitem"
						aria-haspopup={item.children ? true : undefined}
						aria-expanded={item.children
							? openMenuMain === item.label
							: undefined}
					>
						{item.label}
						{#if item.children}
							<span class="dropdown-arrow" aria-hidden="true"
								>▾</span
							>
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
									role="menuitem">{child.label}</a
								>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		<!-- Hamburger moved to HeaderMain for Logo-Search-Menu line alignment -->
	</div>
</nav>

<div class="sticky-nav-bar" class:visible={isVisible} aria-hidden={!isVisible}>
	<div class="nav-inner">
		<a
			href="/"
			class="logo-link"
			tabindex={isVisible ? 0 : -1}
			aria-label="Gartenwoche – Startseite"
		>
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
					onmouseenter={() =>
						item.children && (openMenuSticky = item.label)}
					onmouseleave={() => (openMenuSticky = null)}
				>
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item.href)}
						role="menuitem"
						tabindex={isVisible ? 0 : -1}
						aria-haspopup={item.children ? true : undefined}
						aria-expanded={item.children
							? openMenuSticky === item.label
							: undefined}
					>
						{item.label}
						{#if item.children}
							<span class="dropdown-arrow" aria-hidden="true"
								>▾</span
							>
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
									tabindex={isVisible &&
									openMenuSticky === item.label
										? 0
										: -1}>{child.label}</a
								>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>

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
		font-family: "Roboto", "Open Sans", sans-serif;
		color: #222222;
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 3px solid transparent;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
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
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		line-height: 1;
		color: inherit;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		background: #ffffff;
		border: 1px solid #e0e0e0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 0 0 4px 4px;
		padding: 8px 0;
		min-width: 210px;
		z-index: 200;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.16s ease,
			transform 0.16s ease;
	}

	.dropdown.open {
		opacity: 1;
		pointer-events: auto;
	}

	.dropdown-item {
		display: block;
		padding: 8px 20px;
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		color: #222222;
		text-decoration: none;
		transition:
			background 0.12s ease,
			color 0.12s ease;
	}

	.dropdown-item:hover {
		background: #f7f7f7;
		color: #222222;
	}
	.dropdown-item.active {
		background: #f7f7f7;
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
		content: "";
		display: block;
		height: 1px;
		background: #e0e0e0;
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
		border-bottom: 1px solid #e0e0e0;
		z-index: 1000;
		transform: translateY(-100%);
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.35s ease;
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
	.sticky-nav-bar .logo-link:hover {
		opacity: 0.85;
	}
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
		background: #f8f8f8;
	}
	.sticky-nav-bar .dropdown-item.active {
		background: #f8f8f8;
		color: #5a9e3a;
	}

	/* =========================================================================
	   3. MOBILE PANEL & HAMBURGER STYLES
	   ========================================================================= */
	.mobile-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 9998;
		animation: fadeIn 0.4s ease;
	}
	.mobile-panel {
		position: fixed;
		top: 0;
		right: 0;
		height: 100dvh;
		width: 100vw;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(10px);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		padding: 20px;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes slideInRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.mobile-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 0;
		margin-bottom: 40px;
	}
	.mobile-brand {
		font-family: var(--font-heading);
		font-weight: 900;
		font-size: 28px;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	.mobile-close {
		background: none;
		border: none;
		cursor: pointer;
		color: #fff;
		display: flex;
		align-items: center;
		padding: 8px;
		transition: transform 0.2s ease;
	}
	.mobile-close:hover {
		transform: rotate(90deg);
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding-bottom: 60px;
	}
	.mobile-item-group {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	.mobile-link {
		display: block;
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 700;
		color: #fff;
		text-decoration: none;
		transition: color 0.2s;
	}
	.mobile-link:hover {
		color: var(--color-primary);
	}
	.mobile-children {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-left: 20px;
		border-left: 1px solid rgba(255, 255, 255, 0.2);
	}
	.mobile-child {
		font-size: 16px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.7);
	}

	/* =========================================================================
	   4. RESPONSIVE BREAKPOINTS
	   ========================================================================= */
	@media (max-width: 1023px) {
		.site-nav {
			position: sticky;
			top: 0;
			width: 100%;
			height: 64px;
			z-index: 500;
			background: #fff;
			border-bottom: 1px solid #eee;
		}
		.site-nav .nav-inner {
			justify-content: flex-end;
			height: 100%;
			padding: 0 16px;
		}
		.site-nav .nav-list,
		.sticky-nav-bar {
			display: none;
		}
	}

	/* ── Inline Search Styles ─────────────────────────── */
</style>
