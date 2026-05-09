<script lang="ts">
	let { data } = $props();
	const { user } = data;

	let logoutLoading = $state(false);

	async function handleLogout() {
		logoutLoading = true;
		try {
			await fetch('/api/auth/sign-out', {
				method: 'POST',
				credentials: 'include'
			});
			window.location.href = '/';
		} catch {
			logoutLoading = false;
		}
	}

	function formatDate(d: Date | string) {
		return new Date(d).toLocaleDateString('de-CH', {
			day: '2-digit', month: '2-digit', year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Mein Konto | Gartenwoche</title>
	<meta name="description" content="Verwalten Sie Ihr Gartenwoche-Konto." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="account-page">
	<div class="container container-narrow">

		<nav class="breadcrumb" aria-label="Breadcrumb">
			<a href="/">Start</a>
			<span class="sep">›</span>
			<span>Mein Konto</span>
		</nav>

		<h1 class="page-title">Mein Konto</h1>

		<!-- Profile card -->
		<div class="account-card">
			<div class="account-avatar" aria-hidden="true">
				{user.name?.charAt(0)?.toUpperCase() ?? '?'}
			</div>
			<div class="account-info">
				<p class="account-name">{user.name}</p>
				<p class="account-email">{user.email}</p>
				<p class="account-since">Mitglied seit {formatDate(user.createdAt)}</p>
			</div>
		</div>

		<!-- Actions -->
		<div class="account-section">
			<h2 class="section-label">Konto-Optionen</h2>
			<div class="action-list">
				<a href="/abonnement" class="action-item">
					<span class="action-icon">📰</span>
					<span>Abonnement verwalten</span>
					<span class="action-arrow">›</span>
				</a>
				<a href="/datenschutzerklaerung" class="action-item">
					<span class="action-icon">🔒</span>
					<span>Datenschutzerklärung</span>
					<span class="action-arrow">›</span>
				</a>
			</div>
		</div>

		<!-- Logout -->
		<div class="logout-wrap">
			<button class="logout-btn" onclick={handleLogout} disabled={logoutLoading}>
				{logoutLoading ? 'Abmelden…' : 'Abmelden'}
			</button>
		</div>

	</div>
</div>

<style>
	.account-page {
		padding: 28px 0 56px;
		background: var(--color-bg);
		min-height: calc(100vh - 220px);
	}

	.breadcrumb {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.breadcrumb a { color: var(--color-text-muted); }
	.breadcrumb a:hover { color: var(--color-primary); }
	.sep { color: var(--color-text-faint); }

	.page-title {
		font-family: 'Roboto', sans-serif;
		font-size: 26px;
		font-weight: 800;
		color: var(--color-text);
		margin: 0 0 24px;
	}

	/* Profile card */
	.account-card {
		display: flex;
		align-items: center;
		gap: 20px;
		background: #fff;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 24px;
		margin-bottom: 24px;
	}
	.account-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--color-primary);
		color: #fff;
		font-family: 'Roboto', sans-serif;
		font-size: 22px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.account-name {
		font-family: 'Roboto', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 2px;
	}
	.account-email {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: var(--color-text-muted);
		margin: 0 0 2px;
	}
	.account-since {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: var(--color-text-faint);
		margin: 0;
	}

	/* Section */
	.account-section { margin-bottom: 24px; }
	.section-label {
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin: 0 0 10px;
	}

	.action-list {
		background: #fff;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	.action-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 1px solid var(--color-border);
		transition: background 0.15s;
	}
	.action-item:last-child { border-bottom: none; }
	.action-item:hover { background: var(--color-bg); }
	.action-icon { font-size: 16px; }
	.action-arrow { margin-left: auto; color: var(--color-text-faint); font-size: 18px; }

	/* Logout */
	.logout-wrap { text-align: center; }
	.logout-btn {
		background: none;
		border: 1px solid #cc2200;
		color: #cc2200;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		padding: 9px 24px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s;
	}
	.logout-btn:hover:not(:disabled) { background: #cc2200; color: #fff; }
	.logout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
