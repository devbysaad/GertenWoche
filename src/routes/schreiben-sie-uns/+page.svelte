<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	const crumbs = [{ label: 'Schreiben Sie uns' }];

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let submitted = $state(false);

	function onSubmit(e: Event) {
		e.preventDefault();
		// Placeholder form submission
		submitted = true;
	}
</script>

<svelte:head>
	<title>Schreiben Sie uns | Gartenwoche</title>
	<meta name="description" content="Nehmen Sie Kontakt mit der Redaktion von Gartenwoche auf. Wir freuen uns über Ihre Anregungen, Leserbriefe und Feedback." />
</svelte:head>

<div class="static-page">
	<div class="container container-narrow">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="static-title">Schreiben Sie uns</h1>
		<p class="lead">Haben Sie Fragen, Anregungen oder möchten Sie einen Artikel einreichen? Wir freuen uns über Ihre Nachricht.</p>

		{#if submitted}
			<div class="success-box">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<polyline points="20 6 9 17 4 12" />
				</svg>
				<p>Vielen Dank für Ihre Nachricht! Wir melden uns in Kürze bei Ihnen.</p>
			</div>
		{:else}
			<form class="contact-form" onsubmit={onSubmit}>
				<div class="form-group">
					<label for="contact-name">Name *</label>
					<input id="contact-name" bind:value={name} type="text" required placeholder="Ihr vollständiger Name" />
				</div>
				<div class="form-group">
					<label for="contact-email">E-Mail *</label>
					<input id="contact-email" bind:value={email} type="email" required placeholder="ihre@email.ch" />
				</div>
				<div class="form-group">
					<label for="contact-message">Nachricht *</label>
					<textarea id="contact-message" bind:value={message} required rows="6" placeholder="Ihre Nachricht..."></textarea>
				</div>
				<button type="submit" class="submit-btn">Nachricht senden</button>
			</form>
		{/if}

		<div class="contact-alt">
			<h2>Direkte E-Mail</h2>
			<p>Sie können uns auch direkt erreichen unter:<br />
			<a href="mailto:redaktion@gartenwoche.ch">redaktion@gartenwoche.ch</a></p>
		</div>
	</div>
</div>

<style>
	.static-page { padding: 32px 0 48px; }

	.container-narrow { max-width: 720px; }

	.lead {
		font-family: var(--font-body);
		font-size: 16px;
		color: var(--color-text-muted);
		line-height: 1.7;
		margin-bottom: 28px;
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 32px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.form-group label {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text);
		background: var(--color-surface);
		resize: vertical;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.submit-btn {
		align-self: flex-start;
		padding: 12px 32px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.submit-btn:hover { background: var(--color-primary-hover); }

	.success-box {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		background: #e8f5e9;
		border: 1px solid #4caf50;
		border-radius: var(--radius-md);
		color: #1b5e20;
		font-family: var(--font-body);
		font-size: 15px;
		margin-bottom: 32px;
	}

	.contact-alt {
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 20px 24px;
	}

	.contact-alt h2 {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.contact-alt p {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	.contact-alt a {
		color: var(--color-primary);
		font-weight: 600;
	}
</style>
