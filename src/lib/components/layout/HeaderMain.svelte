<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatGermanFull } from '$lib/utils/date.js';
	import { modalStore } from '$lib/stores/modal.store.js';
	import Logo from './Logo.svelte';
	import SocialIcons from './SocialIcons.svelte';

	interface Props {
		weather: { temp: number | null; city: string };
	}
	let { weather }: Props = $props();

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
			onmouseenter={openMenu}
			onmouseleave={scheduleClose}
		>
			<button type="button" class="mein-konto-btn" aria-haspopup="true" aria-expanded={menuOpen}>
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
					<circle cx="12" cy="7" r="4"/>
				</svg>
				<span>Mein Konto</span>
			</button>

			{#if menuOpen}
				<div
					class="konto-dropdown"
					onmouseenter={openMenu}
					onmouseleave={scheduleClose}
					role="menu"
					tabindex="-1"
				>
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
				<div class="search-popup" role="dialog" aria-label="Suche">
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
