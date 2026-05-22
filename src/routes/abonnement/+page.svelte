<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import { modalStore } from '$lib/stores/modal.store.js';

	const crumbs = [{ label: 'Abonnement' }];
	let isYearly = $state(true);
</script>

<svelte:head>
	<title>Abonnement | Gartenwoche PRO</title>
	<meta name="description" content="Werden Sie PRO-Mitglied bei Gartenwoche und erhalten Sie Zugang zu allen Artikeln." />
</svelte:head>

<div class="abo-page">
	<div class="container">
		<iframe
  src="https://gartenwoche.ch/abonnement/?nocache=1"
  title="Abonnement"
  style="width:100%; height:900px; border:none;"
/>
	</div>
</div>

<style>
	.abo-page {
		padding: 32px 0 80px;
		background: #fcfcfc;
	}

	.abo-hero {
		text-align: center;
		padding: 40px 0 32px;
	}

	.abo-title {
		font-family: 'Roboto', sans-serif;
		font-size: 36px;
		font-weight: 900;
		color: #222;
		margin-bottom: 12px;
	}

	.abo-sub {
		font-family: 'Open Sans', sans-serif;
		font-size: 16px;
		color: #666;
		margin: 0;
	}

	/* Toggle */
	.toggle-wrap {
		display: flex;
		justify-content: center;
		margin-bottom: 40px;
	}

	.toggle-bg {
		background: #EBEBEB;
		padding: 4px;
		border-radius: 30px;
		display: inline-flex;
	}

	.toggle-btn {
		background: transparent;
		border: none;
		padding: 10px 24px;
		font-family: 'Roboto', sans-serif;
		font-size: 15px;
		font-weight: 600;
		color: #555;
		border-radius: 24px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-btn.active {
		background: #fff;
		color: #2D1B69;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	/* Card */
	.abo-card {
		background: #fff;
		border: 2px solid #5a9e3a;
		border-radius: 8px;
		padding: 40px;
		max-width: 480px;
		margin: 0 auto;
		box-shadow: 0 12px 32px rgba(90, 158, 58, 0.1);
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.card-header {
		text-align: center;
		padding-bottom: 24px;
		border-bottom: 1px solid #F0F0F0;
	}

	.price-display {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 6px;
	}

	.price-val {
		font-family: 'Roboto', sans-serif;
		font-size: 56px;
		font-weight: 900;
		color: #5a9e3a;
		line-height: 1;
	}

	.price-curr {
		font-family: 'Roboto', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #222;
	}

	.price-period {
		display: block;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #888;
		margin-top: 8px;
	}

	/* Features */
	.tier-features {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.tier-features li {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: 'Open Sans', sans-serif;
		font-size: 15px;
		color: #444;
	}

	.feat-yes::before {
		content: '✓';
		color: #fff;
		background: #5a9e3a;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 900;
		flex-shrink: 0;
	}

	/* Button */
	.tier-btn {
		display: block;
		width: 100%;
		padding: 16px;
		text-align: center;
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		font-weight: 700;
		border-radius: 4px;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		background: #5a9e3a;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tier-btn:hover {
		background: #4a8230;
	}

	@media (max-width: 600px) {
		.abo-card { padding: 30px 20px; }
		.price-val { font-size: 48px; }
	}
</style>
