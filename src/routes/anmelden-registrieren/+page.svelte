<script lang="ts">
	let loading    = $state(false);
	let errorMsg   = $state('');
	let successMsg = $state('');
	let mode       = $state<'login' | 'register' | 'recover'>('login');

	// Login fields
	let loginUser = $state('');
	let loginPw   = $state('');

	// Register fields
	let regEmail = $state('');
	let regName  = $state('');
	let regPw    = $state('');

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
				body: JSON.stringify({ username: loginUser, password: loginPw }),
				credentials: 'include'
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				errorMsg = d?.error ?? d?.message ?? 'Anmeldung fehlgeschlagen.';
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
				body: JSON.stringify({ email: regEmail, name: regName, password: regPw }),
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
		successMsg = 'Falls ein Konto existiert, wurde ein Link gesendet.';
		loading = false;
	}
</script>

<svelte:head>
	<title>Anmelden - Registrieren | Gartenwoche</title>
	<meta name="description" content="Melden Sie sich an oder erstellen Sie ein Gartenwoche-Konto." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="auth-page">
	<!-- Page heading -->
	<h1 class="page-title">Anmelden - Registrieren</h1>

	<!-- Card -->
	<div class="auth-card">

		{#if mode === 'login'}
			<h2 class="card-heading">Einloggen</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleLogin}>
				<div class="form-row">
					<label for="login-user">Benutzername oder E-mail Adresse</label>
					<input id="login-user" type="text" autocomplete="username"
						bind:value={loginUser} required />
				</div>

				<div class="form-row">
					<div class="pw-label-row">
						<label for="login-pw">Passwort</label>
						<button type="button" class="forgot-link"
							onclick={() => { mode = 'recover'; reset(); }}>
							Passwort vergessen?
						</button>
					</div>
					<input id="login-pw" type="password" autocomplete="current-password"
						bind:value={loginPw} required />
				</div>

				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Einloggen'}
				</button>

				<p class="switch-hint">
					Sie haben kein Konto?
					<button type="button" class="switch-link"
						onclick={() => { mode = 'register'; reset(); }}>
						Registrieren
					</button>
				</p>
			</form>

		{:else if mode === 'register'}
			<h2 class="card-heading">Registrieren</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleRegister}>
				<div class="form-row">
					<label for="reg-name">Benutzername *</label>
					<input id="reg-name" type="text" autocomplete="username"
						bind:value={regName} required />
				</div>
				<div class="form-row">
					<label for="reg-email">E-Mail-Adresse *</label>
					<input id="reg-email" type="email" autocomplete="email"
						bind:value={regEmail} required />
				</div>
				<div class="form-row">
					<label for="reg-pw">Passwort (min. 8 Zeichen) *</label>
					<input id="reg-pw" type="password" autocomplete="new-password"
						minlength="8" bind:value={regPw} required />
				</div>

				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Registrieren'}
				</button>

				<p class="switch-hint">
					Haben Sie bereits ein Konto?
					<button type="button" class="switch-link"
						onclick={() => { mode = 'login'; reset(); }}>
						Einloggen
					</button>
				</p>
				<p class="legal-note">
					Mit der Registrierung akzeptieren Sie unsere
					<a href="/datenschutzerklaerung">Datenschutzerklärung</a>.
				</p>
			</form>

		{:else}
			<h2 class="card-heading">Passwort zurücksetzen</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleRecover}>
				<p class="recover-hint">
					Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
				</p>
				<div class="form-row">
					<label for="rec-email">E-Mail-Adresse</label>
					<input id="rec-email" type="email" autocomplete="email"
						bind:value={recoverEmail} required />
				</div>
				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? 'Wird geladen…' : 'Link senden'}
				</button>
				<button type="button" class="back-btn"
					onclick={() => { mode = 'login'; reset(); }}>
					← Zurück zum Anmelden
				</button>
			</form>
		{/if}

	</div>
</div>

<style>
	/* ── Page shell ────────────────────────────────────────── */
	.auth-page {
		min-height: calc(100vh - 180px);
		background: #f1f1f1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48px 20px 60px;
	}

	.page-title {
		font-family: 'Roboto', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #111;
		text-align: center;
		margin: 0 0 32px;
	}

	/* ── White card ─────────────────────────────────────────── */
	.auth-card {
		width: 100%;
		max-width: 640px;
		background: #fff;
		padding: 36px 40px 44px;
		box-shadow: 0 1px 4px rgba(0,0,0,0.08);
	}

	.card-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 20px;
		font-weight: 400;
		color: #111;
		margin: 0 0 24px;
	}

	/* ── Form ───────────────────────────────────────────────── */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.form-row label {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #333;
	}

	.form-row input {
		width: 100%;
		height: 40px;
		padding: 0 12px;
		border: 1px solid #ccc;
		border-radius: 0;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #111;
		background: #fff;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}
	.form-row input:focus {
		outline: none;
		border-color: #999;
	}

	/* Password row: label left + "Passwort vergessen?" right */
	.pw-label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.forgot-link {
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #0073aa;
		padding: 0;
		text-decoration: none;
	}
	.forgot-link:hover { text-decoration: underline; }

	/* ── Submit button (red) ────────────────────────────────── */
	.submit-btn {
		align-self: flex-start;
		padding: 10px 22px;
		background: #cc0000;
		color: #fff;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 700;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		transition: background 0.2s;
	}
	.submit-btn:hover:not(:disabled) { background: #aa0000; }
	.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

	/* ── Switch hint ────────────────────────────────────────── */
	.switch-hint {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		margin: 0;
		text-align: center;
	}

	.switch-link {
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #0073aa;
		padding: 0;
		text-decoration: none;
	}
	.switch-link:hover { text-decoration: underline; }

	/* ── Feedback ───────────────────────────────────────────── */
	.msg {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		padding: 8px 12px;
		margin: 0 0 4px;
		border-radius: 2px;
	}
	.msg-error   { background: #fff0f0; color: #cc2200; border: 1px solid #fcc; }
	.msg-success { background: #f0fff4; color: #1a7a3a; border: 1px solid #b2f0c8; }

	/* ── Recover / legal ────────────────────────────────────── */
	.recover-hint {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #555;
		margin: 0;
		line-height: 1.6;
	}

	.back-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		padding: 0;
		align-self: flex-start;
	}
	.back-btn:hover { color: #111; }

	.legal-note {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #888;
		margin: 0;
		line-height: 1.6;
		text-align: center;
	}
	.legal-note a { color: #0073aa; text-decoration: underline; }

	/* ── Responsive ─────────────────────────────────────────── */
	@media (max-width: 680px) {
		.auth-card { padding: 24px 20px 32px; }
		.page-title { font-size: 22px; }
	}
</style>
