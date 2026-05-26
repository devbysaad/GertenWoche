<script lang="ts">
	interface Props {
		compact?: boolean;
	}
	let { compact = false }: Props = $props();
</script>

<a href="/" class="logo" class:compact aria-label="Gartenwoche – Startseite">
	<img
		src="/Logo_Gartenwoche-1.png"
		alt="Gartenwoche"
		class="logo-img"
	/>
</a>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		line-height: 1;
	}

	.logo:hover { opacity: 0.85; transition: opacity 0.15s; }

	.logo-img {
		display: block;
		height: 50px;
		width: auto;
		object-fit: contain;
	}

	/* Compact for mobile nav / footer */
	.logo.compact .logo-img {
		height: 32px;
	}
</style>
