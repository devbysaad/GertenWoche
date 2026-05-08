<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	const crumbs = [{ label: 'Stellenangebote für die grüne Branche' }];
</script>

<svelte:head>
	<title>Stellenangebote für die grüne Branche | Gartenwoche</title>
	<meta name="description" content="Stellenangebote in der Gartenbranche – Gärtnerei, Landschaftsbau, Baumschulen und mehr in der Schweiz." />
</svelte:head>

<div class="static-page">
	<div class="container container-narrow">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="static-title">Stellenangebote für die grüne Branche</h1>
		<p class="lead">Offene Stellen in der Garten- und Landschaftsbaubranche in der Schweiz und Europa.</p>

		<div class="jobs-placeholder">
			<div class="jobs-empty">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
					<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
					<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
				</svg>
				<h2>Keine aktuellen Stellenangebote</h2>
				<p>Momentan sind keine Stellen ausgeschrieben. Schauen Sie bald wieder vorbei oder nehmen Sie Kontakt mit uns auf, um Ihre Stelle zu inserieren.</p>
				<a href="/schreiben-sie-uns" class="contact-link">Stellenangebot aufgeben →</a>
			</div>
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
		margin-bottom: 32px;
	}
	.jobs-placeholder {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 48px 24px;
	}
	.jobs-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
	}
	.empty-icon {
		color: var(--color-text-faint);
		margin-bottom: 4px;
	}
	.jobs-empty h2 {
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
	}
	.jobs-empty p {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text-muted);
		max-width: 400px;
		line-height: 1.6;
		margin: 0;
	}
	.contact-link {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-primary);
		margin-top: 4px;
	}
</style>
