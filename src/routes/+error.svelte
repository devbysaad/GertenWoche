<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status === 404 ? '404 – Seite nicht gefunden' : 'Fehler'} | Gartenwoche</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="error-page">
	<div class="container">
		<div class="error-content">
			<div class="error-code">{$page.status}</div>
			<h1 class="error-title">
				{#if $page.status === 404}
					Seite nicht gefunden
				{:else}
					Ein Fehler ist aufgetreten
				{/if}
			</h1>
			<p class="error-message">
				{#if $page.status === 404}
					Die gesuchte Seite existiert leider nicht oder wurde verschoben.
				{:else}
					{$page.error?.message ?? 'Ein unbekannter Fehler ist aufgetreten.'}
				{/if}
			</p>
			<div class="error-actions">
				<a href="/" class="error-btn primary">Zur Startseite</a>
				<button class="error-btn secondary" onclick={() => history.back()}>Zurück</button>
			</div>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: 50vh;
		display: flex;
		align-items: center;
		padding: 48px 0;
	}

	.error-content {
		max-width: 500px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.error-code {
		font-family: var(--font-heading);
		font-size: 96px;
		font-weight: 900;
		color: var(--color-accent);
		line-height: 1;
		text-shadow: 3px 3px 0 var(--color-primary);
	}

	.error-title {
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 800;
		color: var(--color-text);
		margin: 0;
	}

	.error-message {
		font-family: var(--font-body);
		font-size: 15px;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	.error-actions {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}

	.error-btn {
		padding: 12px 28px;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.error-btn.primary {
		background: var(--color-primary);
		color: #fff;
		border: none;
	}

	.error-btn.primary:hover {
		background: var(--color-primary-hover);
	}

	.error-btn.secondary {
		background: none;
		color: var(--color-text-muted);
		border: 1px solid var(--color-border);
	}

	.error-btn.secondary:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>
