<script lang="ts">
	import { modalStore } from "$lib/stores/modal.store.js";

	interface Props {
		open: boolean;
	}
	let { open }: Props = $props();

	const quickLinks = [
		{ label: "Aktuelles", href: "/category/aktuelles/" },
		{ label: "Schweiz", href: "/category/aktuelles/schweiz/" },
		{ label: "Europa", href: "/category/aktuelles/europa/" },
		{ label: "Welt", href: "/category/aktuelles/welt/" },
		{ label: "Produktschau", href: "/category/produktschau/" },
		{ label: "Wissen", href: "/category/wissen/" },
		{ label: "Gartenpraxis", href: "/category/gartenpraxis/" },
		{ label: "Pflanzenschutz", href: "/category/pflanzenschutz/" },
		{
			label: "Pflanzenempfehlungen",
			href: "/category/pflanzen/pflanzenempfehlungen/",
		},
		{ label: "Stauden", href: "/category/pflanzen/stauden/" },
		{ label: "Veranstaltungen", href: "/veranstaltungen/" },
		{
			label: "Stellenangebote für die grüne Branche",
			href: "/stellenangebote-fuer-die-gruene-branche/",
		},
	];
</script>

<div class="topbar" role="navigation" aria-label="Schnellnavigation">
	<div class="topbar-inner">
		<!-- Left: 12 quick-links -->
		<nav class="quick-links" aria-label="Kategorien">
			{#each quickLinks as link}
				<a href={link.href} class="quick-link">{link.label}</a>
			{/each}
		</nav>

		<!-- Right: auth buttons -->
		<div class="auth-buttons">
			<button
				type="button"
				class="auth-btn"
				onclick={() => modalStore.openLogin()}>Anmelden</button
			>
			<button
				type="button"
				class="auth-btn"
				onclick={() => modalStore.openRegister()}>Beitreten</button
			>
		</div>
	</div>
</div>

<style>
	/* ── Topbar shell ───────────────────────────────────────────── */
	.topbar {
		background: #2d1b69;
		height: 36px;
		width: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	/* max-width 1200px container, centered */
	.topbar-inner {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}

	/* ── Quick-links (left) ─────────────────────────────────────── */
	.quick-links {
		display: flex;
		align-items: center;
		gap: 16px;
		overflow: hidden;
		flex: 1;
		min-width: 0;
	}

	.quick-link {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
		transition: color 0.15s ease;
		line-height: 36px;
	}

	.quick-link:hover {
		color: #f7c900;
	}

	/* ── Auth buttons (right) ───────────────────────────────────── */
	.auth-buttons {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	.auth-btn {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.85);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease;
		line-height: 36px;
	}

	.auth-btn:hover {
		color: #f7c900;
	}

	/* ── Mobile <768px: hide ALL quick-links, keep auth only ────── */
	@media (max-width: 767px) {
		.quick-links {
			display: none;
		}
	}
</style>
