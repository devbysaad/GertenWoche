<script lang="ts">
	interface Props {
		position?: 'left' | 'right';
	}
	let { position = 'left' }: Props = $props();

	const AWIN_CLICK_URL = 'https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261';
	const AWIN_IMG_URL   = 'https://www.awin1.com/cshow.php?s=2436107&v=15934&q=368245&r=602261';
</script>

<div class="ad-sidebar" class:left={position === 'left'} class:right={position === 'right'}>
	<span class="ad-label">Werbung</span>
	<a href={AWIN_CLICK_URL} target="_blank" rel="noopener sponsored" aria-label="Werbung">
		<img
			src={AWIN_IMG_URL}
			width="160"
			height="600"
			alt="Werbung"
			loading="lazy"
			style="display:block; background:#F0F0F0;"
		/>
	</a>
</div>

<style>
	.ad-sidebar {
		position: fixed;
		top: 200px;
		display: none;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		z-index: 50;
	}

	.ad-sidebar.left  { left: 8px; }
	.ad-sidebar.right { right: 8px; }

	/* Only show at very wide viewports where there's room beside the 1200px content */
	@media (min-width: 1540px) {
		.ad-sidebar { display: flex; }
	}

	.ad-label {
		font-family: 'Open Sans', sans-serif;
		font-size: 10px;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
</style>
