<script lang="ts">
	interface Props {
		size?: number;
	}
	let { size = 18 }: Props = $props();
</script>

<div class="social-icons" aria-label="Social Media Links">
	<a
		href="https://www.facebook.com/gartenwoche"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Facebook"
		class="social-icon"
	>
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
		</svg>
	</a>

	<a
		href="https://www.instagram.com/gartenwoche/"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="Instagram"
		class="social-icon"
	>
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
			<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
		</svg>
	</a>

	<a
		href="https://x.com/PeterRedaktion"
		target="_blank"
		rel="noopener noreferrer"
		aria-label="X (Twitter)"
		class="social-icon"
	>
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
		</svg>
	</a>
</div>

<style>
	.social-icons {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.social-icon {
		color: #555;
		display: flex;
		align-items: center;
		transition: color 0.15s ease;
	}

	.social-icon:hover {
		color: #222;
	}
</style>
