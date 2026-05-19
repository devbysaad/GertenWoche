<script lang="ts">
	import { goto } from "$app/navigation";
	import { formatGermanFull } from "$lib/utils/date.js";
	import { modalStore } from "$lib/stores/modal.store.js";
	import { mobileMenuOpen, searchOpen } from "$lib/stores/nav.store.js";
	import Logo from "./Logo.svelte";
	import SocialIcons from "./SocialIcons.svelte";

	interface Props {
		weather: { temp: number | null; city: string };
		user?: {
			name: string;
			username: string;
			isPro: boolean;
			avatar?: string;
		} | null;
	}
	let { weather, user = null }: Props = $props();

	const today = formatGermanFull(new Date());

	const tempDisplay = $derived(
		weather.temp !== null ? `${weather.temp.toFixed(1)}°C` : `—°C`,
	);

	// Mein Konto dropdown
	let menuOpen = $state(false);
	let menuTimeout: ReturnType<typeof setTimeout> | null = null;

	function openMenu() {
		if (menuTimeout) clearTimeout(menuTimeout);
		menuOpen = true;
	}
	function scheduleClose() {
		menuTimeout = setTimeout(() => {
			menuOpen = false;
		}, 150);
	}

	async function logout() {
		await fetch("/api/auth/logout", { method: "POST" });
		window.location.reload();
	}

	// ── Search dropdown state ───────────────────────────────────
	let searchQuery = $state("");
	let searchResults = $state<Array<{ title: string; href: string }>>([]);
	let searchInput: HTMLInputElement | undefined = $state(undefined);

	// Focus input when search opens
	$effect(() => {
		if ($searchOpen && searchInput) {
			setTimeout(() => searchInput?.focus(), 50);
		}
	});

	// Live search
	let debounce: ReturnType<typeof setTimeout>;
	function onSearchInput() {
		clearTimeout(debounce);
		if (!searchQuery.trim()) {
			searchResults = [];
			return;
		}
		debounce = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://gartenwoche.ch/wp-json/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=5&_embed`,
					{ signal: AbortSignal.timeout(4000) },
				);
				if (!res.ok) {
					searchResults = [];
					return;
				}
				const posts = await res.json();
				searchResults = posts.map((p: any) => ({
					title: p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
					href:
						(p.link as string)?.replace(
							"https://gartenwoche.ch",
							"",
						) ?? "/",
				}));
			} catch {
				searchResults = [];
			}
		}, 300);
	}

	function submitSearch() {
		const q = searchQuery.trim();
		if (q) goto(`/search?q=${encodeURIComponent(q)}`);
		$searchOpen = false;
		searchQuery = "";
		searchResults = [];
	}

	function toggleSearch() {
		$searchOpen = !$searchOpen;
		if (!$searchOpen) {
			searchQuery = "";
			searchResults = [];
		}
	}

	// Close on Escape or Outside
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape" && $searchOpen) toggleSearch();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
</script>

<!-- Search is now rendered inline in NavPrimary -->

<header class="site-header" class:search-active={$searchOpen}>
	<div class="header-upper">
		<!-- ── LEFT: Weather widget ──────────────────────────── -->
		<div class="thermometer">
			<svg
				class="thermo-icon"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3 7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
				/>
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
			<button
				type="button"
				class="mein-konto-btn"
				aria-haspopup="true"
				aria-expanded={menuOpen}
			>
				{#if user}
					<!-- Logged-in: grey avatar circle + text -->
					<div class="user-avatar-mini">
						{#if user.avatar}
							<img src={user.avatar} alt={user.name} />
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="currentColor"
								width="22"
								height="22"
								aria-hidden="true"
							>
								<path
									d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
								/>
							</svg>
						{/if}
					</div>
					<span class="konto-label">Mein Konto</span>
				{:else}
					<!-- Guest: person icon + text -->
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
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
						<span class="konto-greeting"
							>Hallo, {user.username}</span
						>
						<hr class="konto-divider" />
						<a
							href="/mein-konto"
							class="konto-item konto-link"
							role="menuitem"
							onclick={() => (menuOpen = false)}>Mein Konto</a
						>
						<a
							href="/mein-konto?tab=details"
							class="konto-item konto-link"
							role="menuitem"
							onclick={() => (menuOpen = false)}>Kontodetails</a
						>
						<a
							href="/mein-konto?tab=subs"
							class="konto-item konto-link"
							role="menuitem"
							onclick={() => (menuOpen = false)}>Abonnements</a
						>
						<hr class="konto-divider" />
						<button
							type="button"
							class="konto-item konto-logout"
							role="menuitem"
							onclick={() => {
								menuOpen = false;
								logout();
							}}>Ausloggen ⇥</button
						>
					{:else}
						<!-- Guest dropdown -->
						<button
							type="button"
							class="konto-item"
							role="menuitem"
							onclick={() => {
								menuOpen = false;
								modalStore.openLogin();
							}}>Anmeldung</button
						>
						<button
							type="button"
							class="konto-item"
							role="menuitem"
							onclick={() => {
								menuOpen = false;
								modalStore.openRegister();
							}}>Registrieren</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Lower header: Logo + search ---->
	<div class="header-lower" class:search-active={$searchOpen}>
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
			<div class="search-wrap">
				<button
					class="search-btn"
					type="button"
					onclick={toggleSearch}
					aria-label={$searchOpen
						? "Suche schließen"
						: "Suche öffnen"}
					aria-expanded={$searchOpen}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
				</button>

				{#if $searchOpen}
					<div class="search-dropdown-bubble">
						<div class="search-bubble-arrow"></div>
						<button
							type="button"
							class="search-mobile-close"
							onclick={toggleSearch}
							aria-label="Close search"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								><line x1="18" y1="6" x2="6" y2="18" /><line
									x1="6"
									y1="6"
									x2="18"
									y2="18"
								/></svg
							>
						</button>
						<form
							class="search-bubble-form"
							onsubmit={(e) => {
								e.preventDefault();
								submitSearch();
							}}
						>
							<input
								bind:this={searchInput}
								bind:value={searchQuery}
								oninput={onSearchInput}
								type="search"
								class="search-bubble-input"
								placeholder="type here…"
								autocomplete="off"
							/>
							<button type="submit" class="search-bubble-submit"
								>Suche →</button
							>
						</form>

						{#if searchResults.length > 0}
							<div class="search-bubble-results">
								<p class="results-label">Beiträge</p>
								{#each searchResults as result}
									<a
										href={result.href}
										class="result-item"
										onclick={() => {
											$searchOpen = false;
											searchQuery = "";
										}}
									>
										{result.title}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Mobile Hamburger in same line -->
			<button
				class="hamburger-mobile"
				class:open={$mobileMenuOpen}
				type="button"
				onclick={() => ($mobileMenuOpen = !$mobileMenuOpen)}
				aria-label={$mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
			>
				<span></span><span></span><span></span>
			</button>
		</div>
	</div>
</header>

<style>
	/* ── Header shell ───────────────────────────────────────────── */
	.site-header {
		background: #ffffff;
		width: 100%;
		transition: background 0.3s ease;
	}

	.site-header.search-active {
		background: transparent !important;
		box-shadow: none !important;
		border-bottom-color: transparent !important;
	}

	.header-lower.search-active {
		background: transparent !important;
		border-bottom: none !important;
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
		font-family: "Roboto", sans-serif;
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

	.logo-link:hover {
		opacity: 0.85;
		transition: opacity 0.15s;
	}

	.logo-img {
		display: block;
		max-height: 70px;
		width: auto;
		object-fit: contain;
	}

	.header-date {
		font-family: "Open Sans", sans-serif;
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
		font-family: "Roboto", sans-serif;
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
		color: #2d1b69;
	}

	/* Dropdown */
	.konto-dropdown {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		background: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		min-width: 140px;
		z-index: 200;
		padding: 8px 0;
	}

	.konto-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 8px 20px;
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		color: #222222;
		background: none;
		border: none;
		cursor: pointer;
		transition: background 0.12s ease;
		white-space: nowrap;
	}

	.konto-item:hover {
		background: #f7f7f7;
		color: #2d1b69;
	}

	/* Logged-in dropdown extras */
	.konto-greeting {
		display: block;
		padding: 8px 16px 6px;
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		color: #999;
		white-space: nowrap;
		cursor: default;
		user-select: none;
	}
	.konto-divider {
		border: none;
		border-top: 1px solid #e0e0e0;
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
	.konto-logout:hover {
		color: #c00;
	}

	/* Avatar mini in header button */
	.user-avatar-mini {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #c0c0c0;
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
	.search-btn:hover {
		color: #2d1b69;
	}

	/* ── Search Dropdown Bubble (Desktop) ────────────────── */
	.search-wrap {
		position: relative;
	}

	.search-dropdown-bubble {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 20px;
		width: 480px;
		background: #fdfdfd;
		box-shadow: 0 40px 100px rgba(0, 0, 0, 0.15);
		border: 1px solid #eee;
		padding: 25px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.search-bubble-arrow {
		position: absolute;
		bottom: 100%;
		right: 15px;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 12px solid #fdfdfd;
	}

	.search-bubble-form {
		display: flex;
		align-items: center;
		gap: 0;
		border: 1px solid #eee;
		background: #f9f9f9;
	}

	.search-bubble-input {
		flex: 1;
		background: none;
		border: none;
		padding: 12px 15px;
		font-family: var(--font-body);
		font-size: 15px;
		color: #111;
		outline: none;
	}
	.search-bubble-input::placeholder {
		color: #aaa;
	}

	.search-bubble-submit {
		background: #000;
		color: #fff;
		border: none;
		padding: 12px 25px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.2s;
	}
	.search-bubble-submit:hover {
		background: #333;
	}

	.search-bubble-results {
		display: flex;
		flex-direction: column;
		padding-top: 10px;
		border-top: 1px solid #eee;
	}

	.results-label {
		font-size: 10px;
		text-transform: uppercase;
		font-weight: 800;
		color: #bbb;
		margin-bottom: 10px;
		letter-spacing: 1px;
	}

	.result-item {
		padding: 10px 0;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 600;
		color: #111;
		text-decoration: none;
		border-bottom: 1px solid #f5f5f5;
		transition: color 0.15s;
	}
	.result-item:hover {
		color: #2e8b22;
	}
	.result-item:last-child {
		border-bottom: none;
	}

	.search-mobile-close {
		display: none;
	}

	@media (max-width: 1023px) {
		.search-dropdown-bubble {
			position: fixed;
			inset: 0;
			width: 100vw;
			height: 100dvh;
			margin-top: 0;
			background: rgba(0, 0, 0, 0.85);
			backdrop-filter: blur(12px) saturate(180%);
			padding: 120px 24px 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			z-index: 10001;
			border: none;
			border-radius: 0;
		}
		.search-bubble-arrow {
			display: none;
		}

		.search-mobile-close {
			display: flex;
			position: absolute;
			top: 30px;
			right: 30px;
			background: none;
			border: none;
			color: #fff;
			padding: 10px;
			cursor: pointer;
		}

		.search-bubble-form {
			background: transparent !important;
			border: none;
			border-bottom: 2px solid rgba(255, 255, 255, 0.5);
			width: 100%;
			max-width: 440px;
			display: flex;
			align-items: center;
		}
		.search-bubble-input {
			color: #fff;
			font-size: 26px;
			padding: 12px 0;
			text-align: center;
		}
		.search-bubble-input::placeholder {
			color: rgba(255, 255, 255, 0.35);
		}
		.search-bubble-submit {
			background: transparent;
			color: #fff;
			padding: 10px;
		}

		.search-bubble-results {
			width: 100%;
			max-width: 440px;
			margin-top: 50px;
			border-top: 1px solid rgba(255, 255, 255, 0.15);
		}
		.results-label {
			color: rgba(255, 255, 255, 0.4);
		}
		.result-item {
			color: #fff;
			border-bottom-color: rgba(255, 255, 255, 0.08);
			font-size: 18px;
			padding: 20px 0;
		}
	}

	.hamburger-mobile {
		display: none;
	}

	/* ── Mobile: sticky header + hide top bar ─────────────────────── */
	@media (max-width: 1023px) {
		.site-header {
			position: sticky;
			top: 0;
			z-index: 399;
			background: #fff;
			border-bottom: 1px solid #e0e0e0;
		}
		.header-upper {
			display: none;
		}
		.header-lower {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 16px;
			gap: 12px;
		}
		.spacer {
			display: none;
		}
		.logo-container {
			flex: 0 0 auto;
		}
		.logo-img {
			height: 44px;
		}

		.search-container {
			display: flex;
			align-items: center;
			gap: 8px;
			flex: 1;
			justify-content: flex-end;
		}
		.search-btn {
			padding: 8px;
		}

		.hamburger-mobile {
			display: flex;
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
		.hamburger-mobile span {
			display: block;
			width: 100%;
			height: 2px;
			background: #333;
			border-radius: 2px;
			transition: all 0.25s ease;
		}
		.hamburger-mobile.open span:nth-child(1) {
			transform: translateY(7px) rotate(45deg);
		}
		.hamburger-mobile.open span:nth-child(2) {
			opacity: 0;
			transform: scaleX(0);
		}
		.hamburger-mobile.open span:nth-child(3) {
			transform: translateY(-7px) rotate(-45deg);
		}
	}

	@media (max-width: 767px) {
		.header-lower {
			gap: 10px;
		}
		.logo-img {
			height: 32px;
		}
	}
</style>
