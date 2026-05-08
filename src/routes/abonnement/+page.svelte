<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';
	const crumbs = [{ label: 'Abonnement' }];
</script>

<svelte:head>
	<title>Abonnement | Gartenwoche PRO</title>
	<meta name="description" content="Werden Sie PRO-Mitglied bei Gartenwoche und erhalten Sie Zugang zu exklusiven Gartenartikeln, Expertenrat und mehr." />
</svelte:head>

<div class="abo-page">
	<div class="container">
		<Breadcrumb crumbs={crumbs} />

		<div class="abo-hero">
			<div class="abo-badge-wrap">
				<span class="pro-badge abo-pro-badge">PRO</span>
			</div>
			<h1 class="abo-title">Gartenwoche PRO</h1>
			<p class="abo-sub">Das vollständige Erlebnis für Gartenliebhaber</p>
		</div>

		<div class="abo-tiers">
			<!-- Free -->
			<div class="tier-card">
				<div class="tier-header">
					<h2 class="tier-name">Kostenlos</h2>
					<div class="tier-price"><span class="price-val">0</span><span class="price-curr">CHF</span></div>
					<span class="price-period">für immer</span>
				</div>
				<ul class="tier-features">
					<li class="feat-yes">Zugang zu kostenlosen Artikeln</li>
					<li class="feat-yes">Veranstaltungskalender</li>
					<li class="feat-yes">Newsletter</li>
					<li class="feat-no">PRO-exklusive Artikel</li>
					<li class="feat-no">Expertenberatung</li>
					<li class="feat-no">Pflanzenempfehlungen Premium</li>
				</ul>
				<button class="tier-btn free" onclick={() => modalStore.openRegister()}>
					Kostenlos registrieren
				</button>
			</div>

			<!-- PRO -->
			<div class="tier-card featured">
				<div class="tier-badge">Empfohlen</div>
				<div class="tier-header">
					<h2 class="tier-name">PRO</h2>
					<div class="tier-price"><span class="price-val">9</span><span class="price-curr">CHF</span></div>
					<span class="price-period">pro Monat</span>
				</div>
				<ul class="tier-features">
					<li class="feat-yes">Alle kostenlosen Artikel</li>
					<li class="feat-yes">PRO-exklusive Artikel</li>
					<li class="feat-yes">Expertenberatung</li>
					<li class="feat-yes">Pflanzenempfehlungen Premium</li>
					<li class="feat-yes">Branchenverzeichnis</li>
					<li class="feat-yes">Keine Werbung</li>
				</ul>
				<a href="/schreiben-sie-uns" class="tier-btn pro">Jetzt abonnieren</a>
			</div>
		</div>

		<p class="abo-note">Alle Preise in Schweizer Franken (CHF), inkl. MwSt. Kündigung jederzeit möglich.</p>
	</div>
</div>

<style>
	.abo-page {
		padding: 32px 0 64px;
	}

	.abo-hero {
		text-align: center;
		padding: 40px 0 48px;
	}

	.abo-badge-wrap {
		display: flex;
		justify-content: center;
		margin-bottom: 12px;
	}

	.abo-pro-badge {
		font-size: 16px;
		padding: 6px 16px;
	}

	.abo-title {
		font-family: var(--font-heading);
		font-size: 40px;
		font-weight: 900;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.abo-sub {
		font-family: var(--font-body);
		font-size: 16px;
		color: var(--color-text-muted);
		margin: 0;
	}

	.abo-tiers {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		max-width: 780px;
		margin: 0 auto 24px;
	}

	.tier-card {
		background: var(--color-surface);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 28px;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.tier-card.featured {
		border-color: var(--color-primary);
		box-shadow: 0 8px 32px rgba(45, 27, 105, 0.15);
	}

	.tier-badge {
		position: absolute;
		top: -14px;
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-accent);
		color: var(--color-primary);
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 900;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 4px 14px;
		border-radius: 20px;
		white-space: nowrap;
	}

	.tier-header {
		text-align: center;
	}

	.tier-name {
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 900;
		color: var(--color-text);
		margin-bottom: 12px;
	}

	.tier-price {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 4px;
	}

	.price-val {
		font-family: var(--font-heading);
		font-size: 48px;
		font-weight: 900;
		color: var(--color-primary);
		line-height: 1;
	}

	.price-curr {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		color: var(--color-text-muted);
	}

	.price-period {
		display: block;
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-faint);
		margin-top: 4px;
	}

	.tier-features {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.tier-features li {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.feat-yes::before {
		content: '✓';
		color: var(--color-primary);
		font-weight: 900;
		flex-shrink: 0;
	}

	.feat-no::before {
		content: '✗';
		color: var(--color-text-faint);
		flex-shrink: 0;
	}

	.feat-no {
		opacity: 0.5;
	}

	.tier-btn {
		display: block;
		width: 100%;
		padding: 14px;
		text-align: center;
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		border-radius: var(--radius-md);
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.tier-btn.free {
		background: var(--color-bg);
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
	}

	.tier-btn.free:hover {
		background: var(--color-primary);
		color: #fff;
	}

	.tier-btn.pro {
		background: var(--color-primary);
		color: #fff;
	}

	.tier-btn.pro:hover {
		background: var(--color-primary-hover);
	}

	.abo-note {
		text-align: center;
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-faint);
		max-width: 500px;
		margin: 0 auto;
	}

	@media (max-width: 599px) {
		.abo-tiers { grid-template-columns: 1fr; max-width: 400px; }
	}
</style>
