<svelte:head>
	<title>Anmelden - Registrieren | Gartenwoche</title>
	<meta
		name="description"
		content="Melden Sie sich an oder erstellen Sie ein Gartenwoche-Konto."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="auth-page">
	<h1 class="page-title">Anmelden - Registrieren</h1>

	<div class="iframe-wrap">
		<iframe
			src="https://gartenwoche.ch/anmelden-registrieren/"
			title="Anmelden / Registrieren"
			loading="lazy"
		></iframe>
	</div>

	<p class="hint">
		Hinweis: Das Einbetten funktioniert nur auf der freigegebenen Produktions-Domain
		(<code>gartenwoche-website.vercel.app</code>). Lokal/auf anderen Domains
		wird der Frame vom Server blockiert.
	</p>
</div>

<style>
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
		margin: 0 0 30px;
		letter-spacing: -0.02em;
	}

	.iframe-wrap {
		width: 100%;
		max-width: 720px;
		background: #fff;
		box-shadow:
			0 40px 120px rgba(0, 0, 0, 0.08),
			0 0 1px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
	}

	.iframe-wrap iframe {
		display: block;
		width: 100%;
		height: 820px;
		border: 0;
	}

	.hint {
		max-width: 720px;
		margin: 16px auto 0;
		font-family: var(--font-body);
		font-size: 12px;
		color: #888;
		text-align: center;
		line-height: 1.5;
	}
	.hint code {
		background: #eee;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 11px;
	}

	@media (max-width: 768px) {
		.page-title {
			font-size: 28px;
			margin-bottom: 20px;
		}
		.auth-page {
			padding-top: 40px;
		}
		.iframe-wrap iframe {
			height: 900px;
		}
	}
</style>
