<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatGermanFull } from '$lib/utils/date.js';
	import { modalStore } from '$lib/stores/modal.store.js';
	import Logo from './Logo.svelte';
	import SocialIcons from './SocialIcons.svelte';

	interface Props {
		weather: { temp: number | null; city: string };
		user?: { name: string; username: string; isPro: boolean; avatar?: string } | null;
	}
	let { weather, user = null }: Props = $props();

	const today = formatGermanFull(new Date());

	const tempDisplay = $derived(
		weather.temp !== null ? `${weather.temp.toFixed(1)}°C` : `—°C`
	);

	// Mein Konto dropdown
	let menuOpen = $state(false);
	let menuTimeout: ReturnType<typeof setTimeout> | null = null;

	function openMenu() {
		if (menuTimeout) clearTimeout(menuTimeout);
		menuOpen = true;
	}
	function scheduleClose() {
		menuTimeout = setTimeout(() => { menuOpen = false; }, 150);
	}

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.reload();
	}

	// ── Search popup state ──────────────────────────────────────
	let searchOpen    = $state(false);
	let searchQuery   = $state('');
	let searchResults = $state<Array<{ title: string; href: string; category: string }>>([]);
	let searchWrap: HTMLDivElement | undefined;
	let searchInput: HTMLInputElement | undefined;

	// Close on Escape
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
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

	// Live search — debounced fetch from WP API
	let debounce: ReturnType<typeof setTimeout>;
	function onSearchInput() {
		clearTimeout(debounce);
		if (!searchQuery.trim()) { searchResults = []; return; }
		debounce = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://gartenwoche.ch/wp-json/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=6&_embed`,
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

<header class="site-header">
	<div class="header-upper">

		<!-- ── LEFT: Weather widget ──────────────────────────── -->
		<div class="thermometer">
			<svg class="thermo-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3 7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
			</svg>
			<span class="weather-temp">{tempDisplay}</span>
			<span class="weather-city">{weather.city}</span>
		</div>

		<!-- Todays date -->
		<div>
			<p class="header-date">{today}</p>
		</div>

		<!-- Social icons: Facebook, Instagram, X -->
		<div class="social-icons">
			<SocialIcons size={18} />
		</div>

		<!-- Mein Konto with hover dropdown -->
		<div
			class="mein-konto-wrap"
			role="navigation"
			aria-label="Benutzerkonto"
			onmouseenter={openMenu}
			onmouseleave={scheduleClose}
		>
			<button type="button" class="mein-konto-btn" aria-haspopup="true" aria-expanded={menuOpen}>
				{#if user}
					<!-- Logged-in: grey avatar circle + text -->
					<div class="user-avatar-mini">
						{#if user.avatar}
							<img src={user.avatar} alt={user.name} />
						{:else}
							<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
								<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
							</svg>
						{/if}
					</div>
					<span class="konto-label">Mein Konto</span>
				{:else}
					<!-- Guest: person icon + text -->
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
						<circle cx="12" cy="7" r="4"/>
					</svg>
					<span>Mein Konto</span>
				{/if}
			</button>

			{#if menuOpen}
				<div
					class="konto-dropdown"
					onmouseenter={openMenu}
					onmouseleave={scheduleClose}
					role="menu"
					tabindex="-1"
				>
					{#if user}
						<!-- Logged-in dropdown -->
						<span class="konto-greeting">Hallo, {user.username}</span>
						<hr class="konto-divider" />
						<a href="/mein-konto" class="konto-item konto-link" role="menuitem" onclick={() => (menuOpen = false)}>Mein Konto</a>
						<a href="/mein-konto?tab=details" class="konto-item konto-link" role="menuitem" onclick={() => (menuOpen = false)}>Kontodetails</a>
						<a href="/mein-konto?tab=subs" class="konto-item konto-link" role="menuitem" onclick={() => (menuOpen = false)}>Abonnements</a>
						<hr class="konto-divider" />
						<button
							type="button"
							class="konto-item konto-logout"
							role="menuitem"
							onclick={() => { menuOpen = false; logout(); }}
						>Ausloggen ⇥</button>
					{:else}
						<!-- Guest dropdown -->
						<button
							type="button"
							class="konto-item"
							role="menuitem"
							onclick={() => { menuOpen = false; modalStore.openLogin(); }}
						>Anmeldung</button>
						<button
							type="button"
							class="konto-item"
							role="menuitem"
							onclick={() => { menuOpen = false; modalStore.openRegister(); }}
						>Registrieren</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!--Lower header:  Logo + search ---->
	<div class="header-lower">
		<div class="spacer"></div>

		<div class="logo-container">
			<a href="/" class="logo-link" aria-label="Gartenwoche – Startseite">
				<img
					src="/Logo_Gartenwoche-1.png"
					alt="Gartenwoche"
					class="logo-img"
				/>
			</a>
		</div>

		<div class="search-container">
			<div class="search-wrap" bind:this={searchWrap}>
				<button
					class="search-btn"
					type="button"
					onclick={toggleSearch}
					aria-label={searchOpen ? 'Suche schließen' : 'Suche öffnen'}
					aria-expanded={searchOpen}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
						<circle cx="11" cy="11" r="8"/>
						<line x1="21" y1="21" x2="16.65" y2="16.65"/>
					</svg>
				</button>

				{#if searchOpen}
				<!-- Full-screen search overlay (mobile) + dropdown (desktop) -->
				<div
					class="search-overlay"
					onclick={(e) => { if (e.target === e.currentTarget) { searchOpen = false; searchQuery = ''; } }}
					role="dialog"
					aria-label="Suche"
				>
					<div class="search-popup">
						<form class="search-row" onsubmit={(e) => { e.preventDefault(); submitSearch(); }}>
							<input
								bind:this={searchInput}
								bind:value={searchQuery}
								oninput={onSearchInput}
								type="search"
								class="search-input"
								placeholder="Suche eingeben…"
								autocomplete="off"
							/>
							<button type="submit" class="search-go">Suche →</button>
							<button type="button" class="search-close" onclick={() => { searchOpen = false; searchQuery = ''; }} aria-label="Schließen">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
							</button>
						</form>
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
				</div>
				{/if}
			</div>
		</div>
	</div>
</header>

<style>
	/* ── Header shell ───────────────────────────────────────────── */
	.site-header {
		background: #ffffff;
		width: 100%;
	}

	/* 3-zone flex row, min-height 90px */
	.header-upper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		min-height: 90px;
		gap: 20px;
	}

	/* ── Weather ──────────────────────────────────────────── */
	.thermometer {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #555555;
		flex-shrink: 0;
		min-width: 0;
	}

	.thermo-icon {
		color: #555555;
		flex-shrink: 0;
	}

	.weather-temp {
		color: #555555;
	}

	.weather-city {
		margin-left: 4px;
		color: #555555;
	}

	.logo-link {
		display: block;
		line-height: 0;
		text-decoration: none;
	}

	.logo-link:hover { opacity: 0.85; transition: opacity 0.15s; }

	.logo-img {
		display: block;
		max-height: 70px;
		width: auto;
		object-fit: contain;
	}

	.header-date {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555555;
		margin: 0;
		white-space: nowrap;
		text-align: center;
	}

	/* ──: Social  ─────────────────────────────── */
	.social-icons {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	/* Mein Konto button + dropdown */
	.mein-konto-wrap {
		position: relative;
	}

	.mein-konto-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #333333;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease;
	}

	.mein-konto-btn:hover {
		color: #2D1B69;
	}

	/* Dropdown */
	.konto-dropdown {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		background: #ffffff;
		border: 1px solid #E0E0E0;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
		min-width: 140px;
		z-index: 200;
		padding: 8px 0;
	}

	.konto-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 8px 20px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #222222;
		background: none;
		border: none;
		cursor: pointer;
		transition: background 0.12s ease;
		white-space: nowrap;
	}

	.konto-item:hover {
		background: #F7F7F7;
		color: #2D1B69;
	}

	/* Logged-in dropdown extras */
	.konto-greeting {
		display: block;
		padding: 8px 16px 6px;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		color: #999;
		white-space: nowrap;
		cursor: default;
		user-select: none;
	}
	.konto-divider {
		border: none;
		border-top: 1px solid #E0E0E0;
		margin: 4px 0;
	}
	.konto-link {
		display: block;
		text-decoration: none;
	}
	.konto-logout {
		color: #888;
		width: 100%;
	}
	.konto-logout:hover { color: #c00; }

	/* Avatar mini in header button */
	.user-avatar-mini {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #C0C0C0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
		color: #fff;
	}
	.user-avatar-mini img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.konto-label {
		color: #5a9e3a;
		font-weight: 600;
	}

	/* ── Header Lower Layout ────────────────────────────────────── */
	.header-lower {
		display: grid;
		grid-template-columns: 1fr auto 1fr; 
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 24px 20px;
	}

	.logo-container {
		display: flex;
		justify-content: center;
	}

	.logo-link {
		display: block;
		line-height: 0;
		text-decoration: none;
	}

	.logo-link:hover {
		opacity: 0.85;
		transition: opacity 0.15s;
	}

	.logo-img {
		display: block;
		height: 60px;
		width: auto;
		object-fit: contain;
	}

	.search-container {
		display: flex;
		justify-content: flex-end;
	}

	/* ── Search UI ─────────────────────────── */
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
		color: #111111;
		cursor: pointer;
		padding: 6px;
		border-radius: 4px;
		transition: color 0.15s ease;
	}
	.search-btn:hover { color: #2D1B69; }

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

	/* ── Mobile: sticky header + hide top bar ─────────────────────── */
	@media (max-width: 1023px) {
		.site-header {
			position: sticky;
			top: 0;
			z-index: 399; /* Below the hamburger which is 400 */
			border-bottom: 1px solid #E0E0E0;
		}
		.header-upper { display: none; }
	}

	/* ── Mobile: header-lower becomes slim flex row ─────── */
	@media (max-width: 1023px) {
		.header-lower {
			display: flex;
			align-items: center;
			padding: 10px 16px;
			gap: 0;
		}
		.spacer { display: none; }
		.logo-container {
			justify-content: flex-start;
			flex: 1;
		}
		.logo-img { height: 44px; }
		.search-container {
			flex-shrink: 0;
			margin-right: 48px;
		}
		.search-btn { padding: 8px; }
	}

	/* ── Search: fullscreen overlay on mobile ─────────────── */
	.search-overlay {
		/* default: invisible wrapper on desktop, acts like nothing */
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 300;
	}
	@media (max-width: 1023px) {
		.search-overlay {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.65);
			z-index: 500;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding-top: 0;
			animation: fadeInOv 0.2s ease;
		}
		@keyframes fadeInOv { from { opacity: 0; } to { opacity: 1; } }
		/* popup becomes a full-width bar at the top */
		.search-overlay .search-popup {
			position: static;
			width: 100%;
			max-width: 100%;
			border-radius: 0;
			border: none;
			box-shadow: none;
		}
		.search-close { display: flex !important; }
	}

	/* Close button – hidden on desktop */
	.search-close {
		display: none;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		border-left: 1px solid #f0f0f0;
		padding: 10px 12px;
		cursor: pointer;
		color: #555;
		flex-shrink: 0;
	}
	.search-close:hover { color: #111; }

	/* Desktop popup stays absolute */
	@media (min-width: 1024px) {
		.search-overlay {
			position: static;
			background: none;
			display: block;
		}
		.search-overlay .search-popup {
			position: absolute;
			top: calc(100% + 8px);
			right: 0;
			width: 320px;
			max-width: calc(100vw - 40px);
			background: #ffffff;
			border: 1px solid #E0E0E0;
			border-radius: 4px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}
	}

	/* ── Mobile adjustments ─────────────────────────────────────── */
	@media (max-width: 767px) {
		.header-lower {
			grid-template-columns: auto 1fr;
			gap: 16px;
			padding: 16px;
		}
		.spacer {
			display: none;
		}
		.logo-container {
			justify-content: flex-start;
		}
	}

	@media (max-width: 767px) {
		.header-upper {
			flex-wrap: wrap;
			min-height: auto;
			padding: 12px 16px;
			gap: 8px;
		}
		.social-icons { display: none; }
	}
</style>
