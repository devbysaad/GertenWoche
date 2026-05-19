<script lang="ts">
	import { page } from '$app/stores';
	import { modalStore } from '$lib/stores/modal.store.js';

	let { data } = $props();
	const user = $derived(data.user);

	// Read tab from URL query param (e.g. /mein-konto?tab=details)
	let activeTab = $state($page.url.searchParams.get('tab') ?? 'dashboard');

	// ── Profile form fields ──────────────────────────────────────
	let firstName    = $state('');
	let lastName     = $state('');
	let displayName  = $state('');
	let profileEmail = $state('');
	let currentPw    = $state('');
	let newPw        = $state('');
	let confirmPw    = $state('');
	let avatarFile: File | null = $state(null);
	let avatarPreview = $state('');

	// ── Billing form fields ──────────────────────────────────────
	let billFirstName = $state('');
	let billLastName  = $state('');
	let billCompany   = $state('');
	let billVat       = $state('');
	let billAddress   = $state('');
	let billCountry   = $state('');
	let billCity      = $state('');
	let billDistrict  = $state('');
	let billPostal    = $state('');
	let billPhone     = $state('');
	let billEmail     = $state('');

	// ── Status messages ──────────────────────────────────────────
	let profileSaving = $state(false);
	let profileMsg    = $state('');
	let profileError  = $state('');
	let billSaving    = $state(false);
	let billMsg       = $state('');
	let billError     = $state('');

	// Pre-fill fields when user data is available
	$effect(() => {
		if (user) {
			// Split name into first/last (best effort)
			const parts = (user.name ?? '').split(' ');
			firstName    = parts[0] ?? '';
			lastName     = parts.slice(1).join(' ');
			displayName  = user.username ?? '';
			profileEmail = user.email ?? '';
			avatarPreview = user.avatar ?? '';
		}
	});

	// ── Avatar file pick ─────────────────────────────────────────
	function handleAvatarChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file  = input.files?.[0];
		if (!file) return;
		avatarFile    = file;
		avatarPreview = URL.createObjectURL(file);
	}

	// Drag-and-drop
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (!file || !file.type.startsWith('image/')) return;
		avatarFile    = file;
		avatarPreview = URL.createObjectURL(file);
	}
	function handleDragOver(e: DragEvent) { e.preventDefault(); }

	// ── Save profile ─────────────────────────────────────────────
	async function saveProfile(e: SubmitEvent) {
		e.preventDefault();
		profileMsg   = '';
		profileError = '';

		if (newPw && newPw !== confirmPw) {
			profileError = 'Passwörter stimmen nicht überein.';
			return;
		}

		profileSaving = true;
		try {
			const body: Record<string, string> = {
				first_name:   firstName,
				last_name:    lastName,
				display_name: displayName,
				email:        profileEmail,
			};
			if (newPw)     { body.password = newPw; }

			const res = await fetch('/api/account/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				credentials: 'include',
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				profileError = json.error ?? 'Speichern fehlgeschlagen.';
			} else {
				profileMsg = 'Änderungen gespeichert.';
				currentPw = ''; newPw = ''; confirmPw = '';
			}
		} catch { profileError = 'Netzwerkfehler.'; }
		finally { profileSaving = false; }
	}

	// ── Save billing ─────────────────────────────────────────────
	async function saveBilling(e: SubmitEvent) {
		e.preventDefault();
		billMsg   = '';
		billError = '';
		billSaving = true;
		try {
			const res = await fetch('/api/account/billing', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					first_name: billFirstName, last_name: billLastName,
					company: billCompany, vat: billVat,
					address: billAddress, country: billCountry,
					city: billCity, district: billDistrict,
					postal: billPostal, phone: billPhone, email: billEmail,
				}),
				credentials: 'include',
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) { billError = json.error ?? 'Speichern fehlgeschlagen.'; }
			else          { billMsg   = 'Rechnungsdetails gespeichert.'; }
		} catch { billError = 'Netzwerkfehler.'; }
		finally { billSaving = false; }
	}

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

	const COUNTRIES = [
		'Schweiz','Deutschland','Österreich','Frankreich','Italien','Belgien','Niederlande','Luxemburg','Liechtenstein','Andere'
	];
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
				<!-- ── ACCOUNT DETAILS FORM ────────────────── -->
				<section class="form-section">
					<h2 class="form-section-title">Kontodetails</h2>
					<p class="form-section-sub">Verwalten Sie Ihre Kontodaten.</p>

					<form class="account-form" onsubmit={saveProfile}>
						<!-- Profile picture -->
						<div class="field-row">
							<label class="field-label">Profilbild</label>
							<div
								class="avatar-drop"
								ondrop={handleDrop}
								ondragover={handleDragOver}
								role="button"
								tabindex="0"
								aria-label="Profilbild hochladen"
							>
								{#if avatarPreview}
									<img src={avatarPreview} alt="Profilbild" class="avatar-thumb" />
								{:else}
									<div class="avatar-icon">
										<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1.5"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
									</div>
								{/if}
								<div class="avatar-hint">
									<span>Drag &amp; Drop oder</span>
									<label class="browse-btn" for="avatar-file">Browse</label>
									<input
										id="avatar-file"
										type="file"
										accept="image/*"
										onchange={handleAvatarChange}
										class="sr-only"
									/>
								</div>
								{#if !avatarPreview}<span class="no-file">Keine Datei ausgewählt</span>{/if}
							</div>
						</div>

						<!-- First + Last name -->
						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="acc-firstname" class="field-label">Vorname *</label>
								<input id="acc-firstname" type="text" bind:value={firstName} required class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="acc-lastname" class="field-label">Nachname *</label>
								<input id="acc-lastname" type="text" bind:value={lastName} required class="field-input" />
							</div>
						</div>

						<!-- Display name -->
						<div class="field-wrap">
							<label for="acc-display" class="field-label">Anzeigename *</label>
							<input id="acc-display" type="text" bind:value={displayName} required class="field-input" />
						</div>

						<!-- Email -->
						<div class="field-wrap">
							<label for="acc-email" class="field-label">E-Mail-Adresse *</label>
							<input id="acc-email" type="email" bind:value={profileEmail} required class="field-input" />
						</div>

						<!-- Passwords -->
						<div class="field-wrap">
							<label for="acc-curpw" class="field-label">Aktuelles Passwort <span class="field-hint">(leer lassen = unverändert)</span></label>
							<input id="acc-curpw" type="password" bind:value={currentPw} autocomplete="current-password" class="field-input" />
						</div>
						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="acc-newpw" class="field-label">Neues Passwort <span class="field-hint">(leer lassen = unverändert)</span></label>
								<input id="acc-newpw" type="password" bind:value={newPw} autocomplete="new-password" class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="acc-confirmpw" class="field-label">Neues Passwort bestätigen</label>
								<input id="acc-confirmpw" type="password" bind:value={confirmPw} autocomplete="new-password" class="field-input" />
							</div>
						</div>

						{#if profileError}<p class="form-error">{profileError}</p>{/if}
						{#if profileMsg}<p class="form-success">{profileMsg}</p>{/if}

						<button type="submit" class="btn-save" disabled={profileSaving}>
							{profileSaving ? 'Speichern…' : 'Änderungen speichern'}
						</button>
					</form>
				</section>

				<!-- ── BILLING DETAILS FORM ─────────────────── -->
				<section class="form-section">
					<h2 class="form-section-title">Rechnungsdetails</h2>
					<p class="form-section-sub">Verwalten Sie Ihre Rechnungsinformationen.</p>

					<form class="account-form" onsubmit={saveBilling}>
						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="bill-fn" class="field-label">Vorname *</label>
								<input id="bill-fn" type="text" bind:value={billFirstName} required class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="bill-ln" class="field-label">Nachname *</label>
								<input id="bill-ln" type="text" bind:value={billLastName} required class="field-input" />
							</div>
						</div>

						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="bill-co" class="field-label">Name der Firma (Optional)</label>
								<input id="bill-co" type="text" bind:value={billCompany} class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="bill-vat" class="field-label">VAT number (Optional)</label>
								<input id="bill-vat" type="text" bind:value={billVat} class="field-input" />
							</div>
						</div>

						<div class="field-wrap">
							<label for="bill-addr" class="field-label">Adresse *</label>
							<input id="bill-addr" type="text" bind:value={billAddress} required class="field-input" />
						</div>

						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="bill-country" class="field-label">Land/Region *</label>
								<select id="bill-country" bind:value={billCountry} required class="field-input field-select">
									<option value="">Choose a country...</option>
									{#each COUNTRIES as c}
										<option value={c}>{c}</option>
									{/each}
								</select>
							</div>
							<div class="field-wrap">
								<label for="bill-city" class="field-label">Stadt/Ort *</label>
								<input id="bill-city" type="text" bind:value={billCity} required class="field-input" />
							</div>
						</div>

						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="bill-district" class="field-label">Bezirk *</label>
								<input id="bill-district" type="text" bind:value={billDistrict} required class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="bill-postal" class="field-label">Postleitzahl *</label>
								<input id="bill-postal" type="text" bind:value={billPostal} required class="field-input" />
							</div>
						</div>

						<div class="field-grid-2">
							<div class="field-wrap">
								<label for="bill-phone" class="field-label">Telefon *</label>
								<input id="bill-phone" type="tel" bind:value={billPhone} required class="field-input" />
							</div>
							<div class="field-wrap">
								<label for="bill-email" class="field-label">E-Mail *</label>
								<input id="bill-email" type="email" bind:value={billEmail} required class="field-input" />
							</div>
						</div>

						{#if billError}<p class="form-error">{billError}</p>{/if}
						{#if billMsg}<p class="form-success">{billMsg}</p>{/if}

						<button type="submit" class="btn-save" disabled={billSaving}>
							{billSaving ? 'Speichern…' : 'Änderungen speichern'}
						</button>
					</form>
				</section>

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
		.field-grid-2 { grid-template-columns: 1fr; }
	}

	/* ── Form Sections ─────────────────────────────────────────── */
	.form-section {
		padding: 28px 32px;
		border-bottom: 1px solid #E0E0E0;
	}
	.form-section:last-child { border-bottom: none; }

	.form-section-title {
		font-family: 'Roboto', sans-serif;
		font-size: 17px;
		font-weight: 700;
		color: #222;
		margin: 0 0 4px;
	}
	.form-section-sub {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #888;
		margin: 0 0 20px;
	}

	.account-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field-grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.field-wrap {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-row {
		display: flex;
		align-items: flex-start;
		gap: 20px;
	}
	.field-row > .field-label { min-width: 90px; padding-top: 12px; }

	.field-label {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		font-weight: 600;
		color: #444;
	}

	.field-hint {
		font-weight: 400;
		color: #888;
	}

	.field-input {
		width: 100%;
		padding: 8px 10px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #222;
		border: 1px solid #D0D0D0;
		border-radius: 2px;
		outline: none;
		background: #fff;
		transition: border-color 0.15s;
		box-sizing: border-box;
	}
	.field-input:focus { border-color: #2D1B69; }
	.field-select { cursor: pointer; }

	/* ── Avatar drop zone ──────────────────────────────────────── */
	.avatar-drop {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 160px;
		min-height: 120px;
		border: 1px dashed #ccc;
		border-radius: 4px;
		padding: 12px;
		cursor: pointer;
		background: #fafafa;
		text-align: center;
		transition: border-color 0.15s;
		flex-shrink: 0;
	}
	.avatar-drop:hover { border-color: #2D1B69; }

	.avatar-thumb {
		width: 72px;
		height: 72px;
		object-fit: cover;
		border-radius: 50%;
	}
	.avatar-icon { color: #bbb; }

	.avatar-hint {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #777;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.browse-btn {
		color: #2D1B69;
		cursor: pointer;
		text-decoration: underline;
		font-size: 11px;
	}
	.no-file {
		font-family: 'Open Sans', sans-serif;
		font-size: 10px;
		color: #aaa;
	}
	.sr-only {
		position: absolute;
		width: 1px; height: 1px;
		margin: -1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
		white-space: nowrap;
	}

	/* ── Save button ───────────────────────────────────────────── */
	.btn-save {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		padding: 9px 22px;
		background: #3d8b2f;
		color: #fff;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn-save:hover:not(:disabled) { background: #2d6e22; }
	.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

	/* ── Form messages ─────────────────────────────────────────── */
	.form-error {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #c00;
		margin: 0;
		padding: 8px 12px;
		background: #fff5f5;
		border-left: 3px solid #c00;
		border-radius: 2px;
	}
	.form-success {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #2d7a22;
		margin: 0;
		padding: 8px 12px;
		background: #f0faf0;
		border-left: 3px solid #2d7a22;
		border-radius: 2px;
	}
</style>
