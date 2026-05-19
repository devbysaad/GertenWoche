<script lang="ts">
	let loading = $state(false);
	let errorMsg = $state("");
	let successMsg = $state("");
	let mode = $state<"login" | "register" | "recover">("login");

	// Login fields
	let loginUser = $state("");
	let loginPw = $state("");

	// Register fields
	let regEmail = $state("");
	let regName = $state("");
	let regPw = $state("");

	// Recover
	let recoverEmail = $state("");

	function reset() {
		errorMsg = "";
		successMsg = "";
	}

	async function handleLogin(e: SubmitEvent) {
		e.preventDefault();
		reset();
		loading = true;
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: loginUser,
					password: loginPw,
				}),
				credentials: "include",
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				errorMsg =
					d?.error ?? d?.message ?? "Anmeldung fehlgeschlagen.";
			} else {
				window.location.href = "/mein-konto";
			}
		} catch {
			errorMsg = "Netzwerkfehler.";
		} finally {
			loading = false;
		}
	}

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		reset();
		loading = true;
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: regEmail,
					name: regName,
					password: regPw,
				}),
				credentials: "include",
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				errorMsg = d?.message ?? "Registrierung fehlgeschlagen.";
			} else {
				successMsg = "Konto erstellt! Sie werden weitergeleitet…";
				setTimeout(() => {
					window.location.href = "/mein-konto";
				}, 1200);
			}
		} catch {
			errorMsg = "Netzwerkfehler.";
		} finally {
			loading = false;
		}
	}

	async function handleRecover(e: SubmitEvent) {
		e.preventDefault();
		reset();
		loading = true;
		successMsg = "Falls ein Konto existiert, wurde ein Link gesendet.";
		loading = false;
	}
</script>

<svelte:head>
	<title>Anmelden - Registrieren | Gartenwoche</title>
	<meta
		name="description"
		content="Melden Sie sich an oder erstellen Sie ein Gartenwoche-Konto."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="auth-page">
	<!-- Page heading -->
	<h1 class="page-title">Log in - Register</h1>

	<!-- Card -->
	<div class="auth-card" class:register-mode={mode === "register"}>
		{#if mode === "login"}
			<h2 class="card-heading">Log in</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleLogin}>
				<div class="form-row">
					<label for="login-user">Username or email address</label>
					<input
						id="login-user"
						type="text"
						autocomplete="username"
						bind:value={loginUser}
						required
					/>
				</div>

				<div class="form-row">
					<div class="pw-label-row">
						<label for="login-pw">password</label>
						<button
							type="button"
							class="forgot-link"
							onclick={() => {
								mode = "recover";
								reset();
							}}
						>
							Forgot your password?
						</button>
					</div>
					<input
						id="login-pw"
						type="password"
						autocomplete="current-password"
						bind:value={loginPw}
						required
					/>
				</div>

				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? "loading…" : "Log in"}
				</button>

				<p class="switch-hint">
					Don't have an account?
					<button
						type="button"
						class="switch-link"
						onclick={() => {
							mode = "register";
							reset();
						}}
					>
						Register
					</button>
				</p>
			</form>
		{:else if mode === "register"}
			<h2 class="card-heading">Register</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleRegister}>
				<div class="form-row">
					<label for="reg-email">email address</label>
					<input
						id="reg-email"
						type="email"
						autocomplete="email"
						bind:value={regEmail}
						required
					/>
				</div>
				<div class="form-row">
					<label for="reg-name">Username</label>
					<input
						id="reg-name"
						type="text"
						autocomplete="username"
						bind:value={regName}
						required
					/>
				</div>
				<div class="form-row">
					<label for="reg-pw">password</label>
					<input
						id="reg-pw"
						type="password"
						autocomplete="new-password"
						minlength="8"
						bind:value={regPw}
						required
					/>
				</div>
				<div class="form-row">
					<label for="reg-pw-repeat">Repeat the password</label>
					<input
						id="reg-pw-repeat"
						type="password"
						autocomplete="new-password"
						required
					/>
				</div>

				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? "loading…" : "Register"}
				</button>

				<p class="switch-hint">
					Do you already have an account?
					<button
						type="button"
						class="switch-link"
						onclick={() => {
							mode = "login";
							reset();
						}}
					>
						Log in
					</button>
				</p>
			</form>
		{:else}
			<h2 class="card-heading">Reset Password</h2>

			{#if errorMsg}<p class="msg msg-error">{errorMsg}</p>{/if}
			{#if successMsg}<p class="msg msg-success">{successMsg}</p>{/if}

			<form class="auth-form" onsubmit={handleRecover}>
				<p class="recover-hint">
					Enter your email address. We'll send you a link to reset
					your password.
				</p>
				<div class="form-row">
					<label for="rec-email">Email Address</label>
					<input
						id="rec-email"
						type="email"
						autocomplete="email"
						bind:value={recoverEmail}
						required
					/>
				</div>
				<button type="submit" class="submit-btn" disabled={loading}>
					{loading ? "loading…" : "Send Link"}
				</button>
				<button
					type="button"
					class="back-btn"
					onclick={() => {
						mode = "login";
						reset();
					}}
				>
					← Back to Login
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	/* ── Page shell ────────────────────────────────────────── */
	.auth-page {
		min-height: calc(100vh - 180px);
		background: linear-gradient(to bottom, #f1f1f1 50%, #ffffff 50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 20px 100px;
	}

	.page-title {
		font-family: var(--font-heading);
		font-size: 38px;
		font-weight: 800;
		color: #1a1a1a;
		text-align: center;
		margin: 0 0 50px;
		letter-spacing: -0.02em;
	}

	/* ── White card ─────────────────────────────────────────── */
	.auth-card {
		width: 100%;
		max-width: 720px;
		background: #fff;
		padding: 50px 60px 60px;
		box-shadow:
			0 40px 120px rgba(0, 0, 0, 0.08),
			0 0 1px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	.card-heading {
		font-family: var(--font-heading);
		font-size: 22px;
		font-weight: 700;
		color: #111;
		margin: 0 0 32px;
	}

	/* ── Form ───────────────────────────────────────────────── */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-row label {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		color: #444;
	}

	.form-row input {
		width: 100%;
		height: 48px;
		padding: 0 16px;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		font-family: var(--font-body);
		font-size: 15px;
		color: #111;
		background: #fff;
		box-sizing: border-box;
		transition: all 0.2s ease;
	}
	.form-row input:focus {
		outline: none;
		border-color: #ef4444;
		box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
	}

	/* Password row: label left + "Passwort vergessen?" right */
	.pw-label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.forgot-link {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 600;
		color: #3b82f6;
		padding: 0;
		text-decoration: none;
	}
	.forgot-link:hover {
		text-decoration: underline;
	}

	/* ── Submit button (red) ────────────────────────────────── */
	.submit-btn {
		align-self: center;
		width: 100%;
		max-width: 120px;
		padding: 14px 20px;
		background: #ef4444;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 800;
		text-transform: capitalize;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-top: 10px;
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
	}
	.submit-btn:hover:not(:disabled) {
		background: #dc2626;
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
	}
	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
	}
	.submit-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	/* Register mode button needs to be wider to match image */
	.register-mode .submit-btn {
		max-width: 100%;
	}

	/* ── Switch hint ────────────────────────────────────────── */
	.switch-hint {
		font-family: var(--font-body);
		font-size: 13px;
		color: #777;
		margin-top: 5px;
		text-align: center;
	}

	.switch-link {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		color: #3b82f6;
		padding: 0;
		text-decoration: none;
	}
	.switch-link:hover {
		text-decoration: underline;
	}

	/* ── Feedback ───────────────────────────────────────────── */
	.msg {
		font-family: var(--font-body);
		font-size: 14px;
		padding: 12px 16px;
		margin: 0 0 15px;
		border-radius: 6px;
		line-height: 1.5;
	}
	.msg-error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}
	.msg-success {
		background: #f0fdf4;
		color: #166534;
		border: 1px solid #86efac;
	}

	/* ── Recover / legal ────────────────────────────────────── */
	.recover-hint {
		font-family: var(--font-body);
		font-size: 14px;
		color: #666;
		margin-bottom: 5px;
		line-height: 1.6;
	}

	.back-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		color: #666;
		padding: 10px 0;
		align-self: center;
		transition: color 0.2s;
	}
	.back-btn:hover {
		color: #111;
	}

	.legal-note {
		font-family: var(--font-body);
		font-size: 12px;
		color: #999;
		margin-top: 10px;
		line-height: 1.6;
		text-align: center;
	}
	.legal-note a {
		color: #3b82f6;
		text-decoration: underline;
	}

	/* ── Responsive ─────────────────────────────────────────── */
	@media (max-width: 768px) {
		.auth-card {
			padding: 40px 30px 50px;
		}
		.page-title {
			font-size: 28px;
			margin-bottom: 30px;
		}
		.auth-page {
			padding-top: 40px;
		}
	}
</style>
