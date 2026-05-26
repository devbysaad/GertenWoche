<script lang="ts">
	let { data } = $props();

	let mode = $state<'login' | 'register' | 'recover'>(data.initialTab);
	let loading = $state(false);
	let errorMsg = $state('');
	let successMsg = $state('');

	// Login
	let loginUsername = $state('');
	let loginPassword = $state('');

	// Register
	let regUsername = $state('');
	let regEmail    = $state('');
	let regPassword = $state('');

	// Recover
	let recoverEmail = $state('');

	function setMode(next: 'login' | 'register' | 'recover') {
		mode = next;
		errorMsg = '';
		successMsg = '';
	}

	async function postJson(path: string, payload: unknown) {
		const res = await fetch(path, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			credentials: 'include'
		});
		const data = await res.json().catch(() => ({}));
		return { ok: res.ok, status: res.status, data };
	}

	/**
	 * Use a full-page navigation rather than SvelteKit's client-side
	 * `goto()` after auth. Reason: the moment the `wp_token` cookie is
	 * set, this page's own +page.server.ts load function will throw
	 * `redirect(303, ...)` (the "redirect logged-in users away" guard).
	 * Combined with `invalidateAll()` + `goto()` that produces two
	 * competing navigations on `/__data.json` and intermittently lands
	 * on a 404 ("Seite nicht gefunden"). A hard navigation sidesteps
	 * the client router entirely and matches what LoginModal does.
	 */
	function safeNext(): string {
		const n = data.next;
		if (!n || typeof n !== 'string' || !n.startsWith('/') || n.startsWith('//')) {
			return '/mein-konto';
		}
		return n;
	}

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';
		loading = true;
		const r = await postJson('/api/auth/login', {
			username: loginUsername.trim(),
			password: loginPassword
		});
		if (!r.ok) {
			loading = false;
			errorMsg = r.data?.error ?? 'Anmeldung fehlgeschlagen.';
			return;
		}
		window.location.assign(safeNext());
	}

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';
		loading = true;
		const r = await postJson('/api/auth/register', {
			username:    regUsername.trim(),
			email:       regEmail.trim(),
			password:    regPassword,
			displayName: regUsername.trim()
		});
		if (!r.ok) {
			loading = false;
			errorMsg = r.data?.error ?? 'Registrierung fehlgeschlagen.';
			return;
		}
		window.location.assign(safeNext());
	}

	async function handleRecover(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';
		loading = true;
		const r = await postJson('/api/auth/forgot-password', { email: recoverEmail.trim() });
		loading = false;
		if (!r.ok) {
			errorMsg = r.data?.error ?? 'Anfrage fehlgeschlagen.';
			return;
		}
		successMsg =
			r.data?.message ??
			'Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen gesendet.';
	}
</script>

<svelte:head>
	{#if mode === 'register'}
		<title>Registrieren | Gartenwoche</title>
	{:else if mode === 'recover'}
		<title>Passwort vergessen | Gartenwoche</title>
	{:else}
		<title>Einloggen | Gartenwoche</title>
	{/if}
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="auth-shell">
	<div class="auth-card">
		<h1 class="card-title">
			{#if mode === 'register'}Registrieren
			{:else if mode === 'recover'}Passwort vergessen
			{:else}Einloggen
			{/if}
		</h1>

		{#if errorMsg}
			<p class="msg msg-error" role="alert">{errorMsg}</p>
		{/if}
		{#if successMsg}
			<p class="msg msg-success" role="status">{successMsg}</p>
		{/if}

		{#if mode === 'login'}
			<form class="form" onsubmit={handleLogin} novalidate>
				<div class="field">
					<label class="label" for="login-username">Benutzername oder E-mail Adresse</label>
					<input
						id="login-username"
						class="input"
						type="text"
						autocomplete="username"
						bind:value={loginUsername}
						required
					/>
				</div>

				<div class="field">
					<div class="label-row">
						<label class="label" for="login-password">Passwort</label>
						<button type="button" class="link-right" onclick={() => setMode('recover')}>
							Passwort vergessen?
						</button>
					</div>
					<input
						id="login-password"
						class="input"
						type="password"
						autocomplete="current-password"
						bind:value={loginPassword}
						required
					/>
				</div>

				<div class="actions">
					<button type="submit" class="btn-primary" disabled={loading}>
						{loading ? 'Wird angemeldet…' : 'Einloggen'}
					</button>
				</div>

				<p class="footer-line">
					Sie haben kein Konto?
					<button type="button" class="link-inline" onclick={() => setMode('register')}>
						Registrieren
					</button>
				</p>
			</form>

		{:else if mode === 'register'}
			<form class="form" onsubmit={handleRegister} novalidate>
				<div class="field">
					<label class="label" for="reg-username">Benutzername</label>
					<input
						id="reg-username"
						class="input"
						type="text"
						autocomplete="username"
						minlength="3"
						maxlength="60"
						bind:value={regUsername}
						required
					/>
				</div>

				<div class="field">
					<label class="label" for="reg-email">E-mail Adresse</label>
					<input
						id="reg-email"
						class="input"
						type="email"
						autocomplete="email"
						bind:value={regEmail}
						required
					/>
				</div>

				<div class="field">
					<label class="label" for="reg-password">Passwort</label>
					<input
						id="reg-password"
						class="input"
						type="password"
						autocomplete="new-password"
						minlength="8"
						bind:value={regPassword}
						required
					/>
					<small class="hint">Mindestens 8 Zeichen.</small>
				</div>

				<div class="actions">
					<button type="submit" class="btn-primary" disabled={loading}>
						{loading ? 'Wird erstellt…' : 'Registrieren'}
					</button>
				</div>

				<p class="footer-line">
					Bereits registriert?
					<button type="button" class="link-inline" onclick={() => setMode('login')}>
						Einloggen
					</button>
				</p>
			</form>

		{:else}
			<form class="form" onsubmit={handleRecover} novalidate>
				<div class="field">
					<label class="label" for="recover-email">E-mail Adresse</label>
					<input
						id="recover-email"
						class="input"
						type="email"
						autocomplete="email"
						bind:value={recoverEmail}
						required
					/>
				</div>

				<div class="actions">
					<button type="submit" class="btn-primary" disabled={loading}>
						{loading ? 'Wird gesendet…' : 'Link senden'}
					</button>
				</div>

				<p class="footer-line">
					<button type="button" class="link-inline" onclick={() => setMode('login')}>
						← Zurück zum Einloggen
					</button>
				</p>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth-shell {
		min-height: calc(100vh - 200px);
		background: #f1f1f1;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 60px 20px 100px;
	}

	.auth-card {
		width: 100%;
		/* 1200px matches the site's standard content container, leaving room
		   for the fixed sidebar ads (160×600px, anchored 8px from each edge)
		   that render at viewports ≥ 1540px. Going wider than this covers
		   them up. */
		max-width: 1200px;
		background: #ffffff;
		padding: 44px 56px 40px;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
		border-radius: 4px;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 800;
		color: #111111;
		margin: 0 0 28px;
		letter-spacing: -0.01em;
	}

	.msg {
		font-family: var(--font-body);
		font-size: 13px;
		padding: 10px 14px;
		margin: -8px 0 20px;
		line-height: 1.45;
		border-radius: 3px;
	}
	.msg-error {
		background: #fdecea;
		color: #b3261e;
		border: 1px solid #f5c2bd;
	}
	.msg-success {
		background: #eaf6ec;
		color: #1a7a3a;
		border: 1px solid #b8e0c1;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.label {
		font-family: var(--font-body);
		font-size: 14px;
		font-weight: 700;
		color: #1a1a1a;
	}

	.input {
		width: 100%;
		padding: 11px 14px;
		border: 1.5px solid #d6d6d6;
		border-radius: 3px;
		font-family: var(--font-body);
		font-size: 14px;
		color: #222222;
		background: #ffffff;
		transition: border-color 0.15s, box-shadow 0.15s;
	}
	.input:focus {
		outline: none;
		border-color: #1976d2;
		box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.12);
	}

	.hint {
		font-family: var(--font-body);
		font-size: 12px;
		color: #888;
		margin-top: 2px;
	}

	.actions {
		display: flex;
		justify-content: center;
		margin-top: 14px;
	}

	.btn-primary {
		background: #e53935;
		color: #ffffff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		padding: 11px 34px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		min-width: 140px;
		letter-spacing: 0.01em;
		transition: background 0.15s, transform 0.05s;
	}
	.btn-primary:hover:not(:disabled) {
		background: #c62828;
	}
	.btn-primary:active:not(:disabled) {
		transform: translateY(1px);
	}
	.btn-primary:disabled {
		opacity: 0.65;
		cursor: progress;
	}

	.footer-line {
		font-family: var(--font-body);
		font-size: 13px;
		color: #6a6a6a;
		text-align: center;
		margin: 6px 0 0;
	}

	.link-inline,
	.link-right {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: #1976d2;
		cursor: pointer;
		font-weight: 600;
	}
	.link-inline:hover,
	.link-right:hover {
		text-decoration: underline;
	}

	.link-right {
		font-size: 13px;
		font-weight: 600;
	}

	@media (max-width: 720px) {
		.auth-card {
			padding: 30px 22px 26px;
		}
		.card-title {
			font-size: 20px;
			margin-bottom: 22px;
		}
		.input {
			padding: 10px 12px;
		}
	}
</style>
