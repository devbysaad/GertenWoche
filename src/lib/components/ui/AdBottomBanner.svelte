<script lang="ts">
	import { onMount } from 'svelte';

	const SESSION_KEY = 'gw_bottom_ad_dismissed';
	let dismissed = $state(true); // start hidden, show after mount check

	onMount(() => {
		try {
			dismissed = sessionStorage.getItem(SESSION_KEY) === '1';
		} catch {
			dismissed = false;
		}
	});

	function dismiss() {
		dismissed = true;
		try {
			sessionStorage.setItem(SESSION_KEY, '1');
		} catch { /* ignore */ }
	}

	const AWIN_CLICK_URL = 'https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261';
	const AWIN_IMG_URL   = 'https://www.awin1.com/cshow.php?s=2436107&v=15934&q=368245&r=602261';
</script>

{#if !dismissed}
	<div class="bottom-banner" role="complementary" aria-label="Werbung">
		<div class="banner-inner">
			<span class="ad-label">Werbung</span>
			<a href={AWIN_CLICK_URL} target="_blank" rel="noopener sponsored" aria-label="Werbung öffnen">
				<img
					src={AWIN_IMG_URL}
					width="728"
					height="90"
					alt="Werbung"
					loading="lazy"
					style="display:block; background:#F0F0F0; max-width:100%;"
				/>
			</a>
		</div>
		<button
			class="dismiss-btn"
			onclick={dismiss}
			aria-label="Werbung schließen"
			type="button"
		>✕</button>
	</div>
{/if}

<style>
	.bottom-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		max-height: 110px;
		background: #fff;
		border-top: 1px solid #E0E0E0;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
		z-index: 500;
		display: none; /* hidden on mobile */
		align-items: center;
		justify-content: center;
		padding: 6px 48px 6px 16px;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.bottom-banner { display: flex; }
	}

	.banner-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		max-width: 1200px;
		width: 100%;
		overflow: hidden;
	}
	.banner-inner img {
		max-height: 90px;
		width: auto;
		object-fit: contain;
	}

	.ad-label {
		font-family: 'Open Sans', sans-serif;
		font-size: 10px;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		align-self: flex-start;
	}

	.dismiss-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: 1px solid #E0E0E0;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 11px;
		color: #888;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: border-color 0.15s, color 0.15s;
	}
	.dismiss-btn:hover {
		border-color: #2D1B69;
		color: #2D1B69;
	}
</style>
