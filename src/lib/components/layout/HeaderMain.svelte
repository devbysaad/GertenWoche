<script lang="ts">
	import { formatGermanFull } from '$lib/utils/date.js';
	import { modalStore } from '$lib/stores/modal.store.js';

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
</script>

<header class="site-header" role="banner">
	<div class="header-inner">

		<!-- ── LEFT: Weather widget ──────────────────────────── -->
		<div class="header-left">
			<!-- Thermometer SVG per spec -->
			<svg class="thermo-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3 7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
			</svg>
			<span class="weather-temp">{tempDisplay}</span>
			<span class="weather-city">{weather.city}</span>
		</div>

		<!-- ── CENTER: Logo + date ───────────────────────────── -->
		<div class="header-center">
			<a href="/" class="logo-link" aria-label="Gartenwoche – Startseite">
				<img
					src="/Logo_Gartenwoche-1.png"
					alt="Gartenwoche"
					class="logo-img"
				/>
			</a>
			<p class="header-date">{today}</p>
		</div>

		<!-- ── RIGHT: Social icons + Mein Konto ─────────────── -->
		<div class="header-right">

			<!-- Social icons: Facebook, Instagram, X -->
			<div class="social-icons">
				<a
					href="https://www.facebook.com/gartenwoche"
					target="_blank"
					rel="noopener noreferrer"
					class="social-link"
					aria-label="Facebook"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
					</svg>
				</a>
				<a
					href="https://www.instagram.com/gartenwoche/"
					target="_blank"
					rel="noopener noreferrer"
					class="social-link"
					aria-label="Instagram"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
						<circle cx="12" cy="12" r="4"/>
						<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
					</svg>
				</a>
				<a
					href="https://x.com/PeterRedaktion"
					target="_blank"
					rel="noopener noreferrer"
					class="social-link"
					aria-label="X (Twitter)"
				>
					<!-- X logo mark -->
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
					</svg>
				</a>
			</div>

			<!-- Mein Konto with hover dropdown -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
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
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="konto-dropdown"
						onmouseenter={openMenu}
						onmouseleave={scheduleClose}
						role="menu"
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
	</div>
</header>

<style>
	/* ── Header shell ───────────────────────────────────────────── */
	.site-header {
		background: #ffffff;
		border-bottom: 1px solid #E0E0E0;
		width: 100%;
	}

	/* 3-zone flex row, min-height 90px */
	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		min-height: 90px;
		gap: 20px;
	}

	/* ── LEFT: Weather ──────────────────────────────────────────── */
	.header-left {
		display: flex;
		align-items: center;
		gap: 4px;
		flex: 1;
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
		/* spec: space between icon and temp = 4px (provided by parent gap) */
		color: #555555;
	}

	.weather-city {
		/* spec: space between temp and city = 8px */
		margin-left: 4px; /* gap is already 4px so this adds up to 8px total */
		color: #555555;
	}

	/* ── CENTER: Logo + date ────────────────────────────────────── */
	.header-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 0 0 auto;
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

	/* ── RIGHT: Social + Mein Konto ─────────────────────────────── */
	.header-right {
		display: flex;
		align-items: center;
		gap: 20px;
		flex: 1;
		justify-content: flex-end;
		flex-shrink: 0;
	}

	.social-icons {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.social-link {
		display: flex;
		align-items: center;
		color: #333333;
		text-decoration: none;
		transition: color 0.15s ease;
		line-height: 0;
	}

	.social-link:hover {
		color: #2D1B69;
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

	/* ── Mobile ─────────────────────────────────────────────────── */
	@media (max-width: 767px) {
		.header-inner {
			flex-wrap: wrap;
			min-height: auto;
			padding: 12px 16px;
			gap: 8px;
		}
		.header-left {
			order: 1;
			flex: 0 0 auto;
		}
		.header-center {
			order: 0;
			flex: 0 0 100%;
		}
		.header-right {
			order: 2;
			flex: 0 0 auto;
			gap: 12px;
		}
		/* Hide social icons on mobile, keep Mein Konto */
		.social-icons { display: none; }
	}
</style>
