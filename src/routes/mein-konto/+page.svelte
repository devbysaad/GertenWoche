<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';

	let { data } = $props();
	const user = data.user;

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/';
	}

	function openLogin(event: MouseEvent) {
		event.preventDefault();
		modalStore.openLogin();
	}
</script>

<svelte:head>
	<title>Mein Konto | Gartenwoche</title>
</svelte:head>

<div class="account-page container">
	{#if !user}
		<p>Sie sind nicht angemeldet. <a href="/" onclick={openLogin}>Jetzt anmelden</a></p>
	{:else}
		<div class="account-header">
			{#if user.avatar}
				<img src={user.avatar} alt={user.name} class="avatar" />
			{:else}
				<div class="avatar-placeholder">{user.name[0]}</div>
			{/if}
			<div>
				<h1>Willkommen zurück, {user.name}!</h1>
				<span class="tier-badge" class:pro={user.isPro}>
					{user.isPro ? 'PRO' : 'Gratis'}
				</span>
			</div>
		</div>

		<div class="account-details">
			<h2>Kontoinformationen</h2>
			<p><strong>Benutzername:</strong> {user.username}</p>
			<p><strong>E-Mail:</strong> {user.email}</p>
			<p><strong>Konto-Typ:</strong> {user.isPro ? 'PRO Mitglied' : 'Gratis Mitglied'}</p>
		</div>

		{#if !user.isPro}
			<div class="upgrade-cta">
				<h2>Upgrade auf PRO</h2>
				<p>Erhalten Sie vollen Zugang zu allen Artikeln ohne Einschränkungen.</p>
				<a href="/abonnement" class="btn-primary">Jetzt upgraden</a>
			</div>
		{/if}

		<button class="btn-logout" onclick={logout}>Abmelden</button>
	{/if}
</div>

<style>
	.account-page { max-width: 700px; margin: 40px auto; padding: 0 20px; }
	.account-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
	.avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
	.avatar-placeholder {
		width: 80px; height: 80px; border-radius: 50%;
		background: #2D1B69; color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		font-weight: 700;
		font-family: 'Roboto', sans-serif;
	}
	h1 { font-family: 'Roboto', sans-serif; font-size: 24px; margin: 0 0 8px; }
	.tier-badge {
		display: inline-block; padding: 3px 10px;
		background: #E0E0E0; color: #555; border-radius: 12px;
		font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: 700;
	}
	.tier-badge.pro { background: #F7C900; color: #2D1B69; }
	.account-details { background: #F7F7F7; padding: 20px; border-radius: 6px; margin-bottom: 24px; }
	.account-details h2 { font-family: 'Roboto', sans-serif; font-size: 16px; margin: 0 0 12px; }
	.account-details p { font-family: 'Open Sans', sans-serif; font-size: 14px; margin: 8px 0; color: #555; }
	.upgrade-cta {
		background: #fff; border: 2px solid #F7C900;
		border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;
	}
	.upgrade-cta h2 { font-family: 'Roboto', sans-serif; font-size: 20px; margin: 0 0 8px; }
	.upgrade-cta p { font-family: 'Open Sans', sans-serif; color: #555; margin-bottom: 16px; }
	.btn-primary {
		display: inline-block; background: #2D1B69; color: white;
		padding: 10px 24px; border-radius: 4px;
		font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 14px;
		text-decoration: none;
	}
	.btn-logout {
		background: none; border: 1px solid #E0E0E0;
		padding: 8px 20px; border-radius: 4px; cursor: pointer;
		font-family: 'Open Sans', sans-serif; font-size: 13px; color: #555;
	}
	.btn-logout:hover { border-color: #2D1B69; color: #2D1B69; }
</style>
