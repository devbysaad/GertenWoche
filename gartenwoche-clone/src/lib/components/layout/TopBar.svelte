<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';

	const quickLinks = [
		{ label: 'Aktuelles', href: '/category/aktuelles' },
		{ label: 'Schweiz', href: '/category/aktuelles/schweiz' },
		{ label: 'Europa', href: '/category/aktuelles/europa' },
		{ label: 'Welt', href: '/category/aktuelles/welt' },
		{ label: 'Produktschau', href: '/category/produktschau' },
		{ label: 'Wissen', href: '/category/wissen' },
		{ label: 'Gartenpraxis', href: '/category/gartenpraxis' },
		{ label: 'Pflanzenschutz', href: '/category/pflanzenschutz' },
		{ label: 'Pflanzenempfehlungen', href: '/category/pflanzen/pflanzenempfehlungen' },
		{ label: 'Stauden', href: '/category/pflanzen/stauden' },
		{ label: 'Veranstaltungen', href: '/veranstaltungen' },
		{ label: 'Stellenangebote für die grüne Branche', href: '/stellenangebote-fuer-die-gruene-branche' }
	];
</script>

<div class="topbar" role="navigation" aria-label="Schnellnavigation">
	<div class="container topbar-inner">
		<nav class="topbar-links">
			{#each quickLinks as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>
		<div class="topbar-auth">
			<button onclick={() => modalStore.openLogin()}>Anmelden</button>
			<span class="topbar-divider">|</span>
			<button onclick={() => modalStore.openRegister()}>Beitreten</button>
		</div>
	</div>
</div>

<style>
	.topbar {
		background: var(--color-primary);
		height: var(--topbar-height);
		font-family: var(--font-heading);
		font-size: 12px;
		overflow: hidden;
	}

	.topbar-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		gap: 16px;
	}

	.topbar-links {
		display: flex;
		align-items: center;
		gap: 14px;
		overflow: hidden;
		flex: 1;
		min-width: 0;
	}

	.topbar-links a {
		color: rgba(255, 255, 255, 0.85);
		white-space: nowrap;
		font-size: 11px;
		font-weight: 500;
		transition: color 0.2s ease;
		flex-shrink: 0;
	}

	.topbar-links a:hover {
		color: var(--color-accent);
	}

	.topbar-auth {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.topbar-divider {
		color: rgba(255, 255, 255, 0.3);
		font-size: 11px;
	}

	.topbar-auth button {
		color: rgba(255, 255, 255, 0.9);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 600;
		padding: 0;
		transition: color 0.2s ease;
		white-space: nowrap;
	}

	.topbar-auth button:hover {
		color: var(--color-accent);
	}

	/* Mobile: hide quick-links */
	@media (max-width: 1023px) {
		.topbar-links {
			display: none;
		}
	}
</style>
