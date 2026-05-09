<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';

	let loading     = $state(false);
	let errorMsg    = $state('');
	let successMsg  = $state('');
	let activeTab   = $state<'login' | 'register' | 'recover'>('login');

	// Login
	let loginEmail    = $state('');
	let loginPassword = $state('');

	// Register
	let regEmail    = $state('');
	let regName     = $state('');
	let regPassword = $state('');

	// Recover
	let recoverEmail = $state('');

	function reset() { errorMsg = ''; successMsg = ''; }

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: loginEmail, password: loginPassword }),
				credentials: 'include'
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				errorMsg = d?.message ?? 'Anmeldung fehlgeschlagen.';
			} else {
				window.location.href = '/mein-konto';
			}
		} catch { errorMsg = 'Netzwerkfehler.'; }
		finally { loading = false; }
	}

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: regEmail, name: regName, password: regPassword }),
				credentials: 'include'
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				errorMsg = d?.message ?? 'Registrierung fehlgeschlagen.';
			} else {
				successMsg = 'Konto erstellt! Sie werden weitergeleitet…';
				setTimeout(() => { window.location.href = '/mein-konto'; }, 1200);
			}
		} catch { errorMsg = 'Netzwerkfehler.'; }
		finally { loading = false; }
	}

	async function handleRecover(e: SubmitEvent) {
		e.preventDefault();
		reset(); loading = true;
		successMsg = 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Link gesendet.';
		loading = false;
	}
</script>

<svelte:head>
	<title>Anmelden / Registrieren | Gartenwoche</title>
	<meta name="description" content="Melden Sie sich in Ihrem Gartenwoche-Konto an oder erstellen Sie ein neues Konto." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<!-- Header -->
		<div class="auth-logo">
			<a href="/">
				<img src="/Logo_Gartenwoche-1.png" alt="Gartenwoche" class="logo-img" />
			</a>
		</div>

		<!-- Tabs -->
		<div class="auth-tabs" role="tablist">
			<button
				role="tab"
				class:active={activeTab === 'login'}
				onclick={() => { activeTab = 'login'; reset(); }}
			>Anmelden</button>
			<button
				role="tab"
				class:active={activeTab === 'register'}
				onclick={() => { activeTab = 'register'; reset(); }}
			>Registrieren</button>
		</div>

		<!-- Feedback -->
		{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
		{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

		<!-- ── LOGIN ── -->
		{#if activeTab === 'login'}
			<form class="auth-form" onsubmit={handleLogin}>
				<div class="form-group">
					<label for="p-login-email">E-Mail-Adresse</label>
					<input id="p-login-email" type="email" autocomplete="email" bind:value={loginEmail} required />
				</div>
				<div class="form-group">
					<label for="p-login-pw">Passwort</label>
					<input id="p-login-pw" type="password" autocomplete="current-password" bind:value={loginPassword} required />
				</div>
				<button type="button" class="link-btn" onclick={() => { activeTab = 'recover'; reset(); }}>
					Passwort vergessen?
				</button>
				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Anmelden'}
				</button>
			</form>

		<!-- ── REGISTER ── -->
		{:else if activeTab === 'register'}
			<form class="auth-form" onsubmit={handleRegister}>
				<div class="form-group">
					<label for="p-reg-email">E-Mail-Adresse</label>
					<input id="p-reg-email" type="email" autocomplete="email" bind:value={regEmail} required />
				</div>
				<div class="form-group">
					<label for="p-reg-name">Name</label>
					<input id="p-reg-name" type="text" autocomplete="name" bind:value={regName} required />
				</div>
				<div class="form-group">
					<label for="p-reg-pw">Passwort (min. 8 Zeichen)</label>
					<input id="p-reg-pw" type="password" autocomplete="new-password" minlength="8" bind:value={regPassword} required />
				</div>
				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Registrieren'}
				</button>
				<p class="auth-note">
					Mit der Registrierung akzeptieren Sie unsere
					<a href="/datenschutzerklaerung">Datenschutzerklärung</a>.
				</p>
			</form>

		<!-- ── RECOVER ── -->
		{:else}
			<form class="auth-form" onsubmit={handleRecover}>
				<p class="recover-hint">Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.</p>
				<div class="form-group">
					<label for="p-rec-email">E-Mail-Adresse</label>
					<input id="p-rec-email" type="email" autocomplete="email" bind:value={recoverEmail} required />
				</div>
				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Link senden'}
				</button>
				<button type="button" class="link-btn back" onclick={() => { activeTab = 'login'; reset(); }}>
					← Zurück zum Anmelden
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth-page {
		min-height: calc(100vh - 200px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
		background: var(--color-bg);
	}

	.auth-card {
		width: 100%;
		max-width: 420px;
		background: #fff;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 32px 36px 36px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
	}

	.auth-logo {
		text-align: center;
		margin-bottom: 24px;
	}
	.logo-img {
		max-height: 60px;
		width: auto;
		margin: 0 auto;
	}

	/* Tabs */
	.auth-tabs {
		display: flex;
		border-bottom: 2px solid var(--color-border);
		margin-bottom: 24px;
	}
	.auth-tabs button {
		flex: 1;
		padding: 12px 0;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all 0.2s;
	}
	.auth-tabs button.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	/* Feedback messages */
	.msg {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		margin: 0 0 16px;
	}
	.msg-error   { background: #fff0f0; color: #cc2200; border: 1px solid #fcc; }
	.msg-success { background: #f0fff4; color: #1a7a3a; border: 1px solid #b2f0c8; }

	/* Form */
	.auth-form {
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
		font-family: 'Roboto', sans-serif;
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}
	.form-group input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: var(--color-text);
		background: var(--color-surface);
		transition: border-color 0.2s;
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
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.2s;
		margin-top: 4px;
	}
	.submit-btn:hover:not(:disabled) { background: var(--color-primary-hover); }
	.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

	.link-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: var(--color-primary);
		padding: 0;
		text-align: right;
		transition: opacity 0.15s;
	}
	.link-btn:hover { opacity: 0.7; }
	.link-btn.back  { text-align: center; color: var(--color-text-muted); }

	.auth-note {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: var(--color-text-faint);
		text-align: center;
		margin: 0;
		line-height: 1.6;
	}
	.auth-note a { color: var(--color-primary); text-decoration: underline; }

	.recover-hint {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.6;
	}
</style>
