<script lang="ts">
	import { page } from "$app/stores";
	import { modalStore } from "$lib/stores/modal.store.js";

	let { data } = $props();
	const user = $derived(data.user);

	// Read tab from URL query param
	let activeTab = $state($page.url.searchParams.get("tab") ?? "dashboard");

	// Profile form fields
	let firstName = $state("");
	let lastName = $state("");
	let displayName = $state("");
	let profileEmail = $state("");
	let currentPw = $state("");
	let newPw = $state("");
	let confirmPw = $state("");
	let avatarPreview = $state("");

	// Billing form fields
	let billFirstName = $state("");
	let billLastName = $state("");
	let billCompany = $state("");
	let billVat = $state("");
	let billAddress = $state("");
	let billCountry = $state("");
	let billCity = $state("");
	let billDistrict = $state("");
	let billPostal = $state("");
	let billPhone = $state("");
	let billEmail = $state("");

	// Status messages
	let profileSaving = $state(false);
	let profileMsg = $state("");
	let billSaving = $state(false);
	let billMsg = $state("");

	// Pre-fill fields
	$effect(() => {
		if (user) {
			const parts = (user.name ?? "").split(" ");
			firstName = parts[0] ?? "";
			lastName = parts.slice(1).join(" ");
			displayName = user.username ?? "";
			profileEmail = user.email ?? "";
			avatarPreview = user.avatar ?? "";
		}
	});

	function handleAvatarChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) avatarPreview = URL.createObjectURL(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith("image/")) {
			avatarPreview = URL.createObjectURL(file);
		}
	}

	async function saveProfile(e: SubmitEvent) {
		e.preventDefault();
		profileMsg = "";
		profileSaving = true;
		// Mock delay
		await new Promise((r) => setTimeout(r, 800));
		profileMsg = "Changes saved successfully.";
		profileSaving = false;
	}

	async function saveBilling(e: SubmitEvent) {
		e.preventDefault();
		billMsg = "";
		billSaving = true;
		await new Promise((r) => setTimeout(r, 800));
		billMsg = "Billing details updated.";
		billSaving = false;
	}

	async function logout() {
		await fetch("/api/auth/logout", { method: "POST" });
		window.location.href = "/";
	}

	function getInitial(name: string) {
		return name ? name[0].toUpperCase() : "?";
	}

	const COUNTRIES = [
		"Schweiz",
		"Deutschland",
		"Österreich",
		"Frankreich",
		"Italien",
		"Liechtenstein",
	];
</script>

<svelte:head>
	<title>My Account | Gartenwoche</title>
</svelte:head>

{#if !user}
	<div class="not-logged container">
		<h1>Mein Konto</h1>
		<p>Sie sind nicht angemeldet.</p>
		<button class="btn-primary" onclick={() => modalStore.openLogin()}
			>Login Now</button
		>
	</div>
{:else}
	<div class="account-page-wrapper">
		<div class="account-container">
			<!-- SIDEBAR -->
			<aside class="account-sidebar">
				<div class="sidebar-user">
					<div class="sidebar-avatar-circle">
						{#if user.avatar}
							<img src={user.avatar} alt={user.name} />
						{:else}
							<span>{getInitial(user.name)}</span>
						{/if}
					</div>
					<span class="sidebar-username">{user.username}</span>
				</div>

				<nav class="sidebar-nav">
					<button
						class="nav-btn"
						class:active={activeTab === "dashboard"}
						onclick={() => (activeTab = "dashboard")}
					>
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><rect x="3" y="3" width="7" height="7" /><rect
								x="14"
								y="3"
								width="7"
								height="7"
							/><rect x="3" y="14" width="7" height="7" /><rect
								x="14"
								y="14"
								width="7"
								height="7"
							/></svg
						>
						dashboard
					</button>
					<button
						class="nav-btn"
						class:active={activeTab === "details"}
						onclick={() => (activeTab = "details")}
					>
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path
								d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
							/><circle cx="12" cy="7" r="4" /></svg
						>
						Account details
					</button>
					<button
						class="nav-btn"
						class:active={activeTab === "subs"}
						onclick={() => (activeTab = "subs")}
					>
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path d="M12 2L2 7l10 5 10-5-10-5z" /><path
								d="M2 17l10 5 10-5"
							/><path d="M2 12l10 5 10-5" /></svg
						>
						Subscriptions
					</button>
					<button class="nav-btn logout" onclick={logout}>
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path
								d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
							/><polyline points="16 17 21 12 16 7" /><line
								x1="21"
								y1="12"
								x2="9"
								y2="12"
							/></svg
						>
						Log out
					</button>
				</nav>
			</aside>

			<!-- CONTENT -->
			<main class="account-main">
				{#if activeTab === "dashboard"}
					<h2 class="section-title">Dashboard</h2>
					<p class="section-sub">Welcome to your dashboard.</p>
					<div class="welcome-box">
						<p>
							Hello <strong>{user.name}</strong>, from here you
							can manage your account and view subscriptions.
						</p>
					</div>
				{:else if activeTab === "details"}
					<div class="tab-pane">
						<!-- ACCOUNT DETAILS -->
						<section class="account-section">
							<h2 class="section-title">Account details</h2>
							<p class="section-sub">
								Manage your account details.
							</p>

							<form onsubmit={saveProfile} class="form-layout">
								<div class="profile-row">
									<div class="group">
										<label>Profile picture</label>
										<div
											class="avatar-uploader"
											ondrop={handleDrop}
											ondragover={(e) =>
												e.preventDefault()}
										>
											{#if avatarPreview}
												<img
													src={avatarPreview}
													alt="Preview"
												/>
											{:else}
												<span class="upload-hint"
													>Drag &amp; Drop or Browse</span
												>
											{/if}
											<input
												type="file"
												onchange={handleAvatarChange}
												accept="image/*"
												class="file-input"
											/>
										</div>
									</div>

									<div class="name-grid">
										<div class="group">
											<label>First name *</label>
											<input
												type="text"
												bind:value={firstName}
												required
											/>
										</div>
										<div class="group">
											<label>Last name *</label>
											<input
												type="text"
												bind:value={lastName}
												required
											/>
										</div>
										<div class="group">
											<label>Display name *</label>
											<input
												type="text"
												bind:value={displayName}
												required
											/>
										</div>
										<div class="group">
											<label>Email address *</label>
											<input
												type="email"
												bind:value={profileEmail}
												required
											/>
										</div>
									</div>
								</div>

								<div class="password-grid">
									<div class="group">
										<label
											>Current password <span
												class="help-icon">?</span
											></label
										>
										<input
											type="password"
											bind:value={currentPw}
										/>
									</div>
									<div class="group">
										<label
											>New password <span
												class="help-icon">?</span
											></label
										>
										<input
											type="password"
											bind:value={newPw}
										/>
									</div>
									<div class="group">
										<label>Confirm new password</label>
										<input
											type="password"
											bind:value={confirmPw}
										/>
									</div>
								</div>

								<button
									type="submit"
									class="btn-save"
									disabled={profileSaving}
								>
									{profileSaving
										? "Saving..."
										: "Save Changes"}
								</button>
								{#if profileMsg}<p class="success">
										{profileMsg}
									</p>{/if}
							</form>
						</section>

						<hr class="divider" />

						<!-- INVOICE DETAILS -->
						<section class="account-section">
							<h2 class="section-title">Invoice details</h2>
							<p class="section-sub">
								Manage your billing information.
							</p>

							<form onsubmit={saveBilling} class="form-layout">
								<div class="grid-2">
									<div class="group">
										<label>First name *</label>
										<input
											type="text"
											bind:value={billFirstName}
											required
										/>
									</div>
									<div class="group">
										<label>Last name *</label>
										<input
											type="text"
											bind:value={billLastName}
											required
										/>
									</div>
									<div class="group">
										<label>Company name (Optional)</label>
										<input
											type="text"
											bind:value={billCompany}
										/>
									</div>
									<div class="group">
										<label>VAT number (Optional)</label>
										<input
											type="text"
											bind:value={billVat}
										/>
									</div>
								</div>

								<div class="group">
									<label>Address *</label>
									<input
										type="text"
										bind:value={billAddress}
										required
									/>
								</div>

								<div class="grid-2">
									<div class="group">
										<label>Country/Region *</label>
										<select
											bind:value={billCountry}
											required
										>
											<option value=""
												>Choose a country...</option
											>
											{#each COUNTRIES as c}<option
													value={c}>{c}</option
												>{/each}
										</select>
									</div>
									<div class="group">
										<label>City/Town *</label>
										<input
											type="text"
											bind:value={billCity}
											required
										/>
									</div>
									<div class="group">
										<label>District *</label>
										<input
											type="text"
											bind:value={billDistrict}
											required
										/>
									</div>
									<div class="group">
										<label>Postal code *</label>
										<input
											type="text"
											bind:value={billPostal}
											required
										/>
									</div>
									<div class="group">
										<label>Phone *</label>
										<input
											type="tel"
											bind:value={billPhone}
											required
										/>
									</div>
									<div class="group">
										<label>Email *</label>
										<input
											type="email"
											bind:value={billEmail}
											required
										/>
									</div>
								</div>

								<button
									type="submit"
									class="btn-save"
									disabled={billSaving}
								>
									{billSaving ? "Saving..." : "Save Changes"}
								</button>
								{#if billMsg}<p class="success">
										{billMsg}
									</p>{/if}
							</form>
						</section>
					</div>
				{:else if activeTab === "subs"}
					<h2 class="section-title">Subscriptions</h2>
					<p class="section-sub">All your subscriptions.</p>
					<div class="empty-subs">
						<p>No subscription created.</p>
					</div>
				{/if}
			</main>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #f7f7f7;
	}

	.account-page-wrapper {
		padding: 40px 0 80px;
	}

	.account-container {
		max-width: 1000px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 200px 1fr;
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	/* SIDEBAR */
	.account-sidebar {
		border-right: 1px solid #eee;
		padding: 30px 0;
	}

	.sidebar-user {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20px 30px;
		gap: 12px;
	}

	.sidebar-avatar-circle {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		flex-shrink: 0;
	}
	.sidebar-avatar-circle img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.sidebar-avatar-circle span {
		font-weight: 700;
		color: #aaa;
	}

	.sidebar-username {
		font-family: var(--font-body);
		font-size: 14px;
		font-weight: 700;
		color: #333;
	}

	.nav-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 20px;
		background: none;
		border: none;
		border-right: 3px solid transparent;
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		color: #666;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
	}
	.nav-btn:hover {
		color: #111;
	}
	.nav-btn.active {
		color: #5a9e3a;
		border-right-color: #5a9e3a;
		background: #f9fbf9;
	}

	.icon {
		width: 16px;
		height: 16px;
		opacity: 0.8;
	}

	.logout {
		margin-top: 10px;
		color: #999;
	}

	/* CONTENT */
	.account-main {
		padding: 40px 50px;
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 700;
		color: #111;
		margin: 0 0 5px;
	}
	.section-sub {
		font-family: var(--font-body);
		font-size: 12px;
		color: #999;
		margin: 0 0 30px;
	}

	.form-layout {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.profile-row {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 30px;
		margin-bottom: 20px;
	}

	.avatar-uploader {
		position: relative;
		width: 200px;
		height: 180px;
		border: 1px solid #ddd;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 10px;
		cursor: pointer;
	}
	.avatar-uploader img {
		max-width: 100%;
		max-height: 100%;
		object-fit: cover;
	}
	.upload-hint {
		font-size: 12px;
		font-weight: 700;
		color: #333;
	}
	.file-input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.name-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.password-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		padding-top: 20px;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.group label {
		font-size: 11px;
		font-weight: 700;
		color: #333;
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.help-icon {
		width: 14px;
		height: 14px;
		background: #eee;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 9px;
		color: #888;
	}

	.group input,
	.group select {
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 2px;
		font-size: 13px;
		background: #fff;
		outline: none;
		font-family: var(--font-body);
	}
	.group input:focus {
		border-color: #5a9e3a;
	}

	.btn-save {
		align-self: flex-start;
		background: #26a63a;
		color: #fff;
		border: none;
		padding: 12px 28px;
		border-radius: 4px;
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		cursor: pointer;
		margin-top: 10px;
		transition: background 0.2s;
	}
	.btn-save:hover {
		background: #1f8a2f;
	}

	.divider {
		border: none;
		border-top: 1px solid #f0f0f0;
		margin: 40px 0;
	}

	.success {
		font-size: 12px;
		color: #2e8b22;
		margin-top: 10px;
	}

	.empty-subs {
		background: #f7f7f7;
		padding: 40px;
		border-radius: 4px;
		text-align: center;
		color: #888;
	}

	.welcome-box {
		padding: 24px;
		background: #fcfcfc;
		border: 1px solid #f0f0f0;
		border-radius: 4px;
		line-height: 1.6;
		color: #555;
	}

	@media (max-width: 900px) {
		.account-container {
			grid-template-columns: 1fr;
		}
		.account-sidebar {
			border-right: none;
			border-bottom: 1px solid #eee;
		}
		.profile-row {
			grid-template-columns: 1fr;
		}
		.avatar-uploader {
			margin: 0 auto;
		}
		.password-grid {
			grid-template-columns: 1fr;
		}
		.grid-2 {
			grid-template-columns: 1fr;
		}
		.account-main {
			padding: 30px 20px;
		}
	}
</style>
