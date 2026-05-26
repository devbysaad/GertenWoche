<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';

	interface Props {
		open: boolean;
		activeTab: 'login' | 'register' | 'recover';
	}
	let { open, activeTab }: Props = $props();

	let tab = $state<'login' | 'register' | 'recover'>('login');

	// Keep tab in sync with store
	$effect(() => { tab = activeTab; });

	// Focus first input when opened
	let firstInput = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (open && firstInput) setTimeout(() => firstInput?.focus(), 50);
	});

	// ESC closes
	$effect(() => {
		function onKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape' && open) modalStore.closeModal();
		}
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	// ── Form state ────────────────────────────────────────────
	let loading  = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	// Login form
	let loginUsername = $state('');
	let loginPassword = $state('');

	// Register form
	let regEmail    = $state('');
	let regName     = $state('');
	let regPassword = $state('');

	// Recover form
	let recoverEmail = $state('');

	function reset() { errorMsg = ''; successMsg = ''; }

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		try {
			const res = await fetch('/api/auth/login', {
				method:  'POST',
				headers: { 'Content-Type': 'application/json' },
				body:    JSON.stringify({ username: loginUsername, password: loginPassword }),
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = data?.error ?? 'Anmeldung fehlgeschlagen.';
			} else {
				modalStore.closeModal();
				window.location.reload();
			}
		} catch {
			errorMsg = 'Netzwerkfehler. Bitte versuchen Sie es erneut.';
		} finally {
			loading = false;
		}
	}

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		try {
			const res = await fetch('/api/auth/register', {
				method:  'POST',
				headers: { 'Content-Type': 'application/json' },
				body:    JSON.stringify({
					email:       regEmail,
					password:    regPassword,
					displayName: regName
					// Username is derived server-side from the email local-part
					// when omitted, matching the registration form on the
					// /anmelden-registrieren page.
				}),
				credentials: 'include'
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = data?.error ?? data?.message ?? 'Registrierung fehlgeschlagen.';
			} else {
				successMsg = 'Konto erstellt! Sie sind jetzt angemeldet.';
				setTimeout(() => { modalStore.closeModal(); window.location.reload(); }, 1200);
			}
		} catch {
			errorMsg = 'Netzwerkfehler. Bitte versuchen Sie es erneut.';
		} finally {
			loading = false;
		}
	}

	async function handleRecover(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		try {
			const res = await fetch('/api/auth/forgot-password', {
				method:  'POST',
				headers: { 'Content-Type': 'application/json' },
				body:    JSON.stringify({ email: recoverEmail })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = data?.error ?? 'Anfrage fehlgeschlagen.';
			} else {
				successMsg = data?.message ??
					'Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen gesendet.';
			}
		} catch {
			errorMsg = 'Netzwerkfehler. Bitte versuchen Sie es erneut.';
		} finally {
			loading = false;
		}
	}
</script>

{#if open}
	<!-- Overlay -->
	<div
		class="modal-overlay"
		role="presentation"
		onclick={() => modalStore.closeModal()}
	></div>

	<!-- Dialog -->
	<div
		class="modal-card"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-heading"
	>
		<!-- Close -->
		<button class="modal-close" onclick={() => modalStore.closeModal()} aria-label="Schließen">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<!-- Tab buttons -->
		<div class="modal-tabs" role="tablist">
			<button role="tab" class:active={tab === 'login'} onclick={() => (tab = 'login')}>
				Anmelden
			</button>
			<button role="tab" class:active={tab === 'register'} onclick={() => (tab = 'register')}>
				Registrieren
			</button>
		</div>

		<!-- ====== LOGIN TAB ====== -->
		{#if tab === 'login'}
			<div class="modal-body">
				<h2 id="modal-heading" class="modal-heading">Herzlich willkommen!</h2>
				<p class="modal-sub">Melde dich in deinem Konto an</p>

				{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
				{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

				<form onsubmit={handleLogin} class="modal-form">
					<div class="form-group">
						<label for="login-username">Benutzername</label>
						<input
							id="login-username"
							type="text"
							autocomplete="username"
							bind:this={firstInput}
							bind:value={loginUsername}
							required
						/>
					</div>
					<div class="form-group">
						<label for="login-password">Passwort</label>
						<input
							id="login-password"
							type="password"
							autocomplete="current-password"
							bind:value={loginPassword}
							required
						/>
					</div>

					<button type="button" class="link-btn forgot" onclick={() => (tab = 'recover')}>
						Passwort vergessen?
					</button>

					<button type="submit" class="submit-btn" disabled={loading}>
						{loading ? 'Wird geladen…' : 'Anmelden'}
					</button>

					<div class="divider"><span>oder</span></div>

					<button type="button" class="link-btn" onclick={() => (tab = 'register')}>
						Noch kein Konto? <strong>Ein Konto erstellen</strong>
					</button>

					<p class="modal-note">
						Mit der Anmeldung akzeptieren Sie unsere
						<a href="/datenschutzerklaerung" onclick={() => modalStore.closeModal()}>Datenschutzerklärung</a>.
					</p>
				</form>
			</div>

		<!-- ====== REGISTER TAB ====== -->
		{:else if tab === 'register'}
			<div class="modal-body">
				<h2 id="modal-heading" class="modal-heading">Herzlich willkommen!</h2>
				<p class="modal-sub">Registrieren Sie sich für ein Konto</p>

				{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
				{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

				<form onsubmit={handleRegister} class="modal-form">
					<div class="form-group">
						<label for="reg-email">E-Mail-Adresse</label>
						<input
							id="reg-email"
							type="email"
							autocomplete="email"
							bind:this={firstInput}
							bind:value={regEmail}
							required
						/>
					</div>
					<div class="form-group">
						<label for="reg-name">Name</label>
						<input
							id="reg-name"
							type="text"
							autocomplete="name"
							bind:value={regName}
							required
						/>
					</div>
					<div class="form-group">
						<label for="reg-password">Passwort (min. 8 Zeichen)</label>
						<input
							id="reg-password"
							type="password"
							autocomplete="new-password"
							bind:value={regPassword}
							minlength="8"
							required
						/>
					</div>

					<button type="submit" class="submit-btn" disabled={loading}>
						{loading ? 'Wird geladen…' : 'Registrieren'}
					</button>

					<p class="modal-note">
						Mit der Registrierung akzeptieren Sie unsere
						<a href="/datenschutzerklaerung" onclick={() => modalStore.closeModal()}>Datenschutzerklärung</a>.
					</p>
				</form>
			</div>

		<!-- ====== RECOVER TAB ====== -->
		{:else if tab === 'recover'}
			<div class="modal-body">
				<h2 id="modal-heading" class="modal-heading">Passwort zurücksetzen</h2>
				<p class="modal-sub">Geben Sie Ihre E-Mail-Adresse ein</p>

				{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
				{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

				<form onsubmit={handleRecover} class="modal-form">
					<div class="form-group">
						<label for="recover-email">E-Mail-Adresse</label>
						<input
							id="recover-email"
							type="email"
							autocomplete="email"
							bind:this={firstInput}
							bind:value={recoverEmail}
							required
						/>
					</div>

					<button type="submit" class="submit-btn" disabled={loading}>
						{loading ? 'Wird geladen…' : 'Link senden'}
					</button>

					<button type="button" class="link-btn" onclick={() => (tab = 'login')}>
						← Zurück zum Anmelden
					</button>
				</form>
			</div>
		{/if}
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		z-index: 300;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-card {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		width: min(420px, 94vw);
		max-height: 90dvh;
		overflow-y: auto;
		z-index: 301;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
		animation: modalIn 0.22s ease;
	}

	@keyframes modalIn {
		from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
		to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
	}

	.modal-close {
		position: absolute;
		top: 14px;
		right: 14px;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-faint);
		display: flex;
		align-items: center;
		padding: 4px;
		border-radius: var(--radius-sm);
		transition: color 0.2s ease;
		z-index: 1;
	}

	.modal-close:hover {
		color: var(--color-text);
		background: var(--color-bg);
	}

	.modal-tabs {
		display: flex;
		border-bottom: 2px solid var(--color-border);
	}

	.modal-tabs button {
		flex: 1;
		padding: 14px 0;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all 0.2s ease;
	}

	.modal-tabs button.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	.modal-body {
		padding: 24px 28px 28px;
	}

	.modal-heading {
		font-family: var(--font-heading);
		font-size: 22px;
		font-weight: 800;
		color: var(--color-text);
		margin-bottom: 4px;
	}

	.modal-sub {
		font-size: 13px;
		color: var(--color-text-muted);
		margin-bottom: 20px;
	}

	/* Inline feedback messages */
	.msg {
		font-family: var(--font-body);
		font-size: 13px;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		margin: 0 0 4px;
	}
	.msg-error {
		background: #fff0f0;
		color: #cc2200;
		border: 1px solid #fcc;
	}
	.msg-success {
		background: #f0fff4;
		color: #1a7a3a;
		border: 1px solid #b2f0c8;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.form-group label {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.form-group input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text);
		background: var(--color-surface);
		transition: border-color 0.2s ease;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.submit-btn {
		width: 100%;
		height: 44px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		letter-spacing: 0.03em;
		transition: background 0.2s ease;
		margin-top: 4px;
	}

	.submit-btn:hover {
		background: var(--color-primary-hover);
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--color-text-faint);
		font-size: 12px;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--color-border);
	}

	.link-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
		padding: 0;
		text-align: center;
		transition: color 0.2s ease;
	}

	.link-btn:hover {
		color: var(--color-primary);
	}

	.link-btn.forgot {
		text-align: right;
		font-size: 12px;
	}

	.modal-info {
		font-size: 12px;
		color: var(--color-text-muted);
		background: var(--color-bg);
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		margin: 0;
	}

	.modal-note {
		font-size: 11px;
		color: var(--color-text-faint);
		text-align: center;
		margin: 0;
		line-height: 1.5;
	}

	.modal-note a {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
