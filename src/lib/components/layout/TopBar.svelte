<script lang="ts">
	import { modalStore } from "$lib/stores/modal.store.js";
	import { authStore } from "$lib/stores/auth.store.js";

	interface Props { open: boolean; }
	let { open }: Props = $props();

	const user = $derived($authStore.user);

	const quickLinks = [
		{ label: "Aktuelles",                href: "/category/aktuelles/" },
		{ label: "Schweiz",                  href: "/category/aktuelles/schweiz/" },
		{ label: "Europa",                   href: "/category/aktuelles/europa/" },
		{ label: "Welt",                     href: "/category/aktuelles/welt/" },
		{ label: "Produktschau",             href: "/category/produktschau/" },
		{ label: "Wissen",                   href: "/category/wissen/" },
		{ label: "Gartenpraxis",             href: "/category/gartenpraxis/" },
		{ label: "Pflanzenschutz",           href: "/category/pflanzenschutz/" },
		{ label: "Pflanzenempfehlungen",     href: "/category/pflanzen/pflanzenempfehlungen/" },
		{ label: "Stauden",                  href: "/category/pflanzen/stauden/" },
		{ label: "Veranstaltungen",          href: "/veranstaltungen/" },
		{ label: "Stellenangebote",          href: "/stellenangebote-fuer-die-gruene-branche/" },
	];

	function getInitials(name: string) {
		return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
	}
</script>

<div class="topbar" role="navigation" aria-label="Schnellnavigation">
	<div class="topbar-inner">
		<!-- Left: quick-links -->
		<nav class="quick-links" aria-label="Kategorien">
			{#each quickLinks as link}
				<a href={link.href} class="quick-link">{link.label}</a>
			{/each}
		</nav>

		<!-- Right: auth area -->
		<div class="auth-area">
			{#if user}
				<!-- Logged-in: avatar + name + Mein Konto -->
				<a href="/mein-konto" class="user-chip" title="Mein Konto">
					{#if user.avatar}
						<img src={user.avatar} alt={user.name} class="user-avatar" width="22" height="22" />
					{:else}
						<span class="user-initials">{getInitials(user.name)}</span>
					{/if}
					<span class="user-name">{user.name}</span>
				</a>
				<button
					type="button"
					class="auth-btn"
					onclick={() => authStore.logout()}
				>Abmelden</button>
			{:else}
				<!-- Guest: login + register -->
				<button type="button" class="auth-btn" onclick={() => modalStore.openLogin()}>Anmelden</button>
				<button type="button" class="auth-btn auth-btn-join" onclick={() => modalStore.openRegister()}>Beitreten</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.topbar {
		background: #333;
		height: 36px;
		width: 100%;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

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

	/* ── Quick-links ── */
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
		color: rgba(255,255,255,0.8);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
		transition: color 0.15s ease;
		line-height: 36px;
	}
	.quick-link:hover { color: #fff; }

	/* ── Auth area ── */
	.auth-area {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-shrink: 0;
	}

	.auth-btn {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		color: rgba(255,255,255,0.85);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s ease;
		line-height: 36px;
	}
	.auth-btn:hover { color: #fff; }
	.auth-btn-join {
		background: rgba(255,255,255,0.15);
		padding: 2px 10px;
		border-radius: 3px;
		line-height: 1;
		height: 22px;
		display: flex;
		align-items: center;
	}
	.auth-btn-join:hover { background: rgba(255,255,255,0.25); }

	/* ── Logged-in chip ── */
	.user-chip {
		display: flex;
		align-items: center;
		gap: 7px;
		text-decoration: none;
		transition: opacity 0.15s;
	}
	.user-chip:hover { opacity: 0.85; }

	.user-avatar {
		border-radius: 50%;
		object-fit: cover;
		width: 22px;
		height: 22px;
		flex-shrink: 0;
	}

	.user-initials {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #5a9e3a;
		color: #fff;
		font-family: "Roboto", sans-serif;
		font-size: 10px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.user-name {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		color: rgba(255,255,255,0.9);
		white-space: nowrap;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ── Mobile ── */
	@media (max-width: 767px) {
		.quick-links { display: none; }
		.user-name { display: none; }
	}
</style>
