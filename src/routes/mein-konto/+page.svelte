<script lang="ts">
	import { page } from '$app/stores';
	import { modalStore } from '$lib/stores/modal.store.js';

	let { data } = $props();
	const user = $derived(data.user);

	// Read tab from URL query param (e.g. /mein-konto?tab=details)
	let activeTab = $state($page.url.searchParams.get('tab') ?? 'dashboard');

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/';
	}

	function getInitial(name: string) {
		return name ? name[0].toUpperCase() : '?';
	}

	function openLogin(e: MouseEvent) {
		e.preventDefault();
		modalStore.openLogin();
	}
</script>

<svelte:head>
	<title>Mein Konto | Gartenwoche</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if !user}
	<div class="not-logged container">
		<h1>Mein Konto</h1>
		<p>Sie sind nicht angemeldet.</p>
		<button class="btn-login-open" onclick={openLogin}>
			Jetzt anmelden
		</button>
	</div>
{:else}
<div class="account-page container">
	<h1 class="account-heading">Mein Konto</h1>
	<div class="account-layout">

		<!-- ── SIDEBAR ─────────────────────────────────────────── -->
		<aside class="account-sidebar">
			<div class="sidebar-user">
				<div class="sidebar-avatar">
					{#if user.avatar}
						<img src={user.avatar} alt={user.name} />
					{:else}
						<span>{getInitial(user.name)}</span>
					{/if}
				</div>
				<strong class="sidebar-name">{user.username}</strong>
			</div>
			<nav class="sidebar-nav">
				<button
					class="snav-item"
					class:active={activeTab === 'dashboard'}
					onclick={() => (activeTab = 'dashboard')}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
						<rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
					</svg>
					dashboard
				</button>
				<button
					class="snav-item"
					class:active={activeTab === 'details'}
					onclick={() => (activeTab = 'details')}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
						<circle cx="12" cy="7" r="4"/>
					</svg>
					Kontodetails
				</button>
				<button
					class="snav-item"
					class:active={activeTab === 'subs'}
					onclick={() => (activeTab = 'subs')}
				>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M12 2L2 7l10 5 10-5-10-5z"/>
						<path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
					</svg>
					Abonnements
				</button>
				<button class="snav-item snav-logout" onclick={logout}>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
						<polyline points="16 17 21 12 16 7"/>
						<line x1="21" y1="12" x2="9" y2="12"/>
					</svg>
					Ausloggen
				</button>
			</nav>
		</aside>

		<!-- ── MAIN CONTENT ────────────────────────────────────── -->
		<main class="account-main">

			{#if !user.isPro}
				<div class="activation-banner">
					<span>Bitte aktivieren Sie Ihr Konto über den Link, der an Ihre E-Mail-Adresse gesendet wurde.</span>
					<button class="resend-btn">Aktivierungslink erneut senden</button>
				</div>
			{/if}

			<!-- DASHBOARD TAB -->
			{#if activeTab === 'dashboard'}
				<h2 class="tab-title">dashboard</h2>
				<p class="tab-sub">Willkommen in Ihrem Konto!</p>
				<div class="dash-info">
					<p>
						Hallo <strong>{user.name}</strong> (nicht {user.name}?
						<button class="link-btn" onclick={logout}>Abmelden</button>)
						Über Ihr Konto-Dashboard können Sie Ihre Abonnements einsehen und Ihre Kontodaten verwalten.
					</p>
				</div>
				<div class="credits-block">
					<h3>Verfügbare Credits</h3>
					<p class="credits-sub">Die Anzahl der verbleibenden Punkte, die zum Entsperren eines Artikels benötigt werden.</p>
					<div class="credits-badge">Punkte <span>0</span></div>
				</div>

			<!-- KONTODETAILS TAB -->
			{:else if activeTab === 'details'}
				<h2 class="tab-title">Kontodetails</h2>
				<div class="details-grid">
					<div class="detail-field">
						<label for="field-username">Benutzername</label>
						<input id="field-username" type="text" value={user.username} readonly />
					</div>
					<div class="detail-field">
						<label for="field-email">E-Mail-Adresse</label>
						<input id="field-email" type="email" value={user.email} readonly />
					</div>
					<div class="detail-field">
						<label for="field-name">Anzeigename</label>
						<input id="field-name" type="text" value={user.name} readonly />
					</div>
					<div class="detail-field">
						<label for="field-tier">Konto-Typ</label>
						<div class="tier-row" id="field-tier">
							<span class="tier-badge" class:pro={user.isPro}>{user.isPro ? 'PRO' : 'Gratis'}</span>
							{#if !user.isPro}
								<a href="/abonnement" class="upgrade-link">Auf PRO upgraden</a>
							{/if}
						</div>
					</div>
				</div>

			<!-- ABONNEMENTS TAB -->
			{:else if activeTab === 'subs'}
				<h2 class="tab-title">Abonnements</h2>
				{#if user.isPro}
					<div class="sub-active">
						<span class="sub-badge">PRO Aktiv</span>
						<p>Sie haben vollen Zugang zu allen Artikeln.</p>
					</div>
				{:else}
					<div class="sub-empty">
						<p>Sie haben derzeit kein aktives Abonnement.</p>
						<a href="/abonnement" class="btn-upgrade">Jetzt PRO werden</a>
					</div>
				{/if}
			{/if}

		</main>
	</div>
</div>
{/if}

<style>
	.account-page { max-width: 1000px; margin: 40px auto; padding: 0 20px; }

	.account-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #222;
		text-align: center;
		margin-bottom: 24px;
		padding-bottom: 12px;
		border-bottom: 1px solid #E0E0E0;
	}

	/* Layout */
	.account-layout {
		display: grid;
		grid-template-columns: 260px 1fr;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		background: white;
		overflow: hidden;
	}

	/* ── Sidebar ── */
	.account-sidebar { border-right: 1px solid #E0E0E0; }

	.sidebar-user {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 20px;
		border-bottom: 1px solid #E0E0E0;
	}

	.sidebar-avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		overflow: hidden;
		background: #E0E0E0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.sidebar-avatar span {
		font-family: 'Roboto', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #555;
	}

	.sidebar-name {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #222;
	}

	/* Sidebar nav */
	.sidebar-nav { padding: 8px 0; }

	.snav-item {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 20px;
		background: none;
		border: none;
		border-left: 3px solid transparent;
		cursor: pointer;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		text-align: left;
		transition: all 0.15s;
	}
	.snav-item:hover { color: #2D1B69; background: #F7F7F7; }
	.snav-item.active {
		color: #2D1B69;
		border-left-color: #2D1B69;
		background: #F7F7F7;
		font-weight: 700;
	}
	.snav-logout { color: #888; margin-top: 8px; }
	.snav-logout:hover { color: #c00; }

	/* ── Main ── */
	.account-main { padding: 24px 28px; }

	.activation-banner {
		background: #fff3cd;
		border: 1px solid #ffc107;
		border-radius: 4px;
		padding: 12px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 20px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #856404;
	}

	.resend-btn {
		background: #2D1B69;
		color: white;
		border: none;
		cursor: pointer;
		padding: 6px 12px;
		border-radius: 3px;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
	}

	/* Tab headings */
	.tab-title {
		font-family: 'Roboto', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #222;
		margin: 0 0 4px;
	}
	.tab-sub {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #777;
		margin: 0 0 20px;
	}

	/* Dashboard */
	.dash-info {
		background: #F7F7F7;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		padding: 14px 16px;
		margin-bottom: 24px;
	}
	.dash-info p {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		margin: 0;
		line-height: 1.6;
	}
	.link-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: #2D1B69;
		font-size: 13px;
		text-decoration: underline;
		padding: 0;
	}

	/* Credits */
	.credits-block { margin-top: 8px; }
	.credits-block h3 {
		font-family: 'Roboto', sans-serif;
		font-size: 15px;
		font-weight: 700;
		margin: 0 0 4px;
	}
	.credits-sub {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #777;
		margin: 0 0 12px;
	}
	.credits-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #E0E0E0;
		padding: 6px 14px;
		border-radius: 3px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #555;
	}
	.credits-badge span { font-weight: 700; color: #222; }

	/* Details tab */
	.details-grid { display: flex; flex-direction: column; gap: 16px; }
	.detail-field { display: flex; flex-direction: column; gap: 4px; }
	.detail-field label {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.detail-field input {
		border: 1px solid #E0E0E0;
		border-radius: 3px;
		padding: 8px 10px;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #222;
		background: #F7F7F7;
	}
	.tier-row { display: flex; align-items: center; gap: 12px; }
	.tier-badge {
		display: inline-block;
		padding: 4px 10px;
		border-radius: 12px;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 700;
		background: #E0E0E0;
		color: #555;
	}
	.tier-badge.pro { background: #F7C900; color: #2D1B69; }
	.upgrade-link {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #2D1B69;
	}

	/* Subscriptions tab */
	.sub-active { display: flex; flex-direction: column; gap: 8px; }
	.sub-badge {
		display: inline-block;
		background: #F7C900;
		color: #2D1B69;
		padding: 4px 12px;
		border-radius: 12px;
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 13px;
	}
	.sub-empty { text-align: center; padding: 32px; }
	.sub-empty p { font-family: 'Open Sans', sans-serif; color: #555; margin-bottom: 16px; }
	.btn-upgrade {
		display: inline-block;
		background: #2D1B69;
		color: white;
		padding: 10px 24px;
		border-radius: 4px;
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 14px;
		text-decoration: none;
	}

	/* Not logged in */
	.not-logged { text-align: center; padding: 60px 20px; }
	.not-logged h1 {
		font-family: 'Roboto', sans-serif;
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 12px;
	}
	.not-logged p { font-family: 'Open Sans', sans-serif; color: #555; margin-bottom: 20px; }
	.btn-login-open {
		display: inline-block;
		background: #2D1B69;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 4px;
		font-family: 'Roboto', sans-serif;
		font-weight: 700;
		font-size: 14px;
		cursor: pointer;
	}

	/* ── Responsive ── */
	@media (max-width: 768px) {
		.account-layout { grid-template-columns: 1fr; }
		.account-sidebar { border-right: none; border-bottom: 1px solid #E0E0E0; }
		.sidebar-nav { display: flex; flex-wrap: wrap; padding: 8px 12px; gap: 4px; }
		.snav-item {
			width: auto;
			border-left: none;
			border-bottom: 2px solid transparent;
			padding: 8px 12px;
		}
		.snav-item.active {
			border-bottom-color: #2D1B69;
			border-left-color: transparent;
		}
		.activation-banner { flex-direction: column; align-items: flex-start; }
	}
</style>
