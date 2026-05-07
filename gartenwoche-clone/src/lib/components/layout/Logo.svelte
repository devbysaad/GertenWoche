<script lang="ts">
	interface Props {
		compact?: boolean;
	}
	let { compact = false }: Props = $props();
</script>

<a href="/" class="logo" class:compact aria-label="Gartenwoche – Startseite">
	<span class="logo-text">
		<span class="logo-garten">Garten</span><span class="logo-woche">woche</span>
	</span>
	{#if !compact}
		<span class="logo-tagline">Das unabhängige Gartenmagazin</span>
	{/if}
</a>

<style>
	.logo {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		line-height: 1;
		gap: 2px;
	}

	.logo:hover {
		color: inherit;
	}

	.logo-text {
		font-family: var(--font-heading);
		font-weight: 900;
		font-size: 28px;
		letter-spacing: -0.5px;
		line-height: 1;
	}

	.logo.compact .logo-text {
		font-size: 20px;
	}

	.logo-garten {
		color: var(--color-primary);
	}

	.logo-woche {
		color: var(--color-accent);
	}

	.logo-tagline {
		font-family: var(--font-heading);
		font-size: 10px;
		font-weight: 400;
		color: var(--color-text-muted);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
</style>
