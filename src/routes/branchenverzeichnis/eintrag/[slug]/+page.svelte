<script lang="ts">
	let { data } = $props();
	const entry = $derived(data.entry);

	const fullAddress = $derived(
		[
			entry.address,
			entry.zip && entry.city ? `${entry.zip} ${entry.city}` : entry.city,
			entry.country,
		]
			.filter(Boolean)
			.join(", "),
	);

	const pageTitle = $derived(
		`${entry.name} | Branchenverzeichnis | Gartenwoche`,
	);

	function formatWebsite(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, "");
		} catch {
			return url;
		}
	}

	let activeTab = $state("reviews");
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta
		name="description"
		content={`${entry.name} – ${entry.city}, ${entry.country}. ${entry.description?.slice(0, 150) ?? ""}`}
	/>
	<link
		rel="canonical"
		href="https://gartenwoche.ch/branchenverzeichnis/eintrag/{entry.slug}"
	/>
</svelte:head>

<div class="entry-page">
	<div class="container">
		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Brotkrümelpfad">
			<a href="/">Home</a>
			<span class="bc-sep">›</span>
			<a href="/branchenverzeichnis">Branchenverzeichnis</a>
			<span class="bc-sep">›</span>
			<span>{entry.name}</span>
		</nav>

		<!-- Main card -->
		<div class="entry-card">
			<!-- Top section: Logo left + Contact right -->
			<div class="entry-top">
				<div class="entry-header">
					<!-- Logo -->
					<div class="entry-logo-wrap">
						{#if entry.logo && entry.logo.trim() !== ""}
							<img
								src={entry.logo}
								alt="{entry.name} Logo"
								class="entry-logo-img"
								loading="eager"
							/>
						{:else}
							<div class="entry-logo-ph">
								<span
									>{entry.name
										.split(" ")
										.slice(0, 2)
										.map((w) => w[0])
										.join("")
										.toUpperCase()}</span
								>
							</div>
						{/if}
					</div>

					<!-- Contact details -->
					<div class="entry-contact">
						{#if fullAddress}
							<div class="contact-row">
								<svg
									class="ci"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-label="Adresse"
								>
									<path
										d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
									/><circle cx="12" cy="10" r="3" />
								</svg>
								<span>{fullAddress}</span>
							</div>
						{/if}

						{#if entry.phone}
							{#each entry.phone as tel}
								<div class="contact-row">
									<svg
										class="ci"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-label="Telefon"
									>
										<path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.42 2 2 0 0 1 3.62 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l.91-1.36a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
										/>
									</svg>
									<a
										href="tel:{tel.replace(/\s/g, '')}"
										class="contact-link">{tel}</a
									>
								</div>
							{/each}
						{/if}

						{#if entry.email}
							<div class="contact-row">
								<svg
									class="ci"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-label="E-Mail"
								>
									<rect
										x="2"
										y="4"
										width="20"
										height="16"
										rx="2"
									/><path d="M2 8l10 7 10-7" />
								</svg>
								<a
									href="mailto:{entry.email}"
									class="contact-link">{entry.email}</a
								>
							</div>
						{/if}

						{#if entry.website}
							<div class="contact-row">
								<svg
									class="ci"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-label="Webseite"
								>
									<circle cx="12" cy="12" r="10" /><line
										x1="2"
										y1="12"
										x2="22"
										y2="12"
									/><path
										d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
									/>
								</svg>
								<a
									href={entry.website}
									target="_blank"
									rel="noopener noreferrer"
									class="contact-link"
								>
									{entry.website}
								</a>
							</div>
						{/if}
					</div>
				</div>

				<!-- Description -->
				{#if entry.description}
					<div class="entry-desc">
						{#each entry.description.split("\n\n") as para}
							<p>{para}</p>
						{/each}
					</div>
				{/if}

				<!-- Action buttons -->
				<div class="entry-actions">
					<div class="left-actions">
						<button
							class="action-btn"
							type="button"
							aria-label="Share"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<circle cx="18" cy="5" r="3" /><circle
									cx="6"
									cy="12"
									r="3"
								/><circle cx="18" cy="19" r="3" /><line
									x1="8.59"
									y1="13.51"
									x2="15.42"
									y2="17.49"
								/><line
									x1="15.41"
									y1="6.51"
									x2="8.59"
									y2="10.49"
								/>
							</svg>
							Share
						</button>
						<button
							class="action-btn"
							type="button"
							aria-label="Bookmark"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
								/>
							</svg>
							Bookmark
						</button>
						<a
							href="/schreiben-sie-uns"
							class="action-btn action-claim"
						>
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
							Claim this Listing
						</a>
					</div>
				</div>
			</div>

			<!-- Tabs -->
			<div class="entry-footer">
				<div class="entry-tabs" role="tablist">
					<button
						class="tab-item"
						class:active={activeTab === "reviews"}
						onclick={() => (activeTab = "reviews")}
						role="tab"
					>
						Reviews
					</button>
					<button
						class="tab-item"
						class:active={activeTab === "photos"}
						onclick={() => (activeTab = "photos")}
						role="tab"
					>
						Photos (1)
					</button>
					<button
						class="tab-item"
						class:active={activeTab === "related"}
						onclick={() => (activeTab = "related")}
						role="tab"
					>
						Related Listings
					</button>
					<button
						class="tab-item"
						class:active={activeTab === "nearby"}
						onclick={() => (activeTab = "nearby")}
						role="tab"
					>
						Nearby Listings
					</button>
				</div>

				<button class="btn-write-review">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M12 20h9" /><path
							d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
						/>
					</svg>
					Write a Review
				</button>
			</div>

			<!-- Tab content panel -->
			<div class="tab-content">
				{#if activeTab === "reviews"}
					<div class="panel-inner fade-in">
						<p class="empty-msg">
							Noch keine Bewertungen vorhanden.
						</p>
					</div>
				{:else if activeTab === "photos"}
					<div class="panel-inner fade-in">
						<p class="empty-msg">Keine Fotos zum Anzeigen.</p>
					</div>
				{:else if activeTab === "related"}
					<div class="panel-inner fade-in">
						<p class="empty-msg">
							Keine verwandten Einträge gefunden.
						</p>
					</div>
				{:else if activeTab === "nearby"}
					<div class="panel-inner fade-in">
						<p class="empty-msg">
							Keine Einträge in der Nähe gefunden.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.entry-page {
		padding: 20px 0 48px;
		background: #f7f7f7;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 16px;
		font-family: "Open Sans", sans-serif;
		font-size: 12px;
		color: #777;
		flex-wrap: wrap;
	}
	.breadcrumb a {
		color: #2d1b69;
		text-decoration: none;
	}
	.breadcrumb a:hover {
		text-decoration: underline;
	}
	.bc-sep {
		color: #ccc;
	}

	.entry-card {
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	/* Header area: Logo + Contact */
	.entry-header {
		display: flex;
		gap: 40px;
		padding: 32px 32px 24px;
		border-bottom: 1px solid #f0f0f0;
	}

	.entry-logo-wrap {
		width: 220px;
		flex-shrink: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.entry-logo-img {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}
	.entry-logo-ph {
		width: 100%;
		aspect-ratio: 4/3;
		background: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #eee;
	}
	.entry-logo-ph span {
		font-family: "Roboto", sans-serif;
		font-size: 24px;
		font-weight: 900;
		color: #ccc;
	}

	.entry-contact {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}
	.contact-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #333;
		line-height: 1.4;
	}
	.ci {
		flex-shrink: 0;
		margin-top: 2px;
		color: #888;
	}
	.contact-link {
		color: #2d1b69;
		text-decoration: none;
		transition: color 0.2s;
	}
	.contact-link:hover {
		color: #3573ab;
		text-decoration: underline;
	}

	/* Description */
	.entry-desc {
		padding: 24px 32px;
		border-bottom: 1px solid #f0f0f0;
	}
	.entry-desc p {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #444;
		line-height: 1.7;
		margin-bottom: 16px;
	}
	.entry-desc p:last-child {
		margin-bottom: 0;
	}

	/* Actions Row */
	.entry-actions {
		padding: 16px 32px;
		background: #fff;
		border-bottom: 1px solid #f0f0f0;
	}
	.left-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 16px;
		background: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #444;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s;
	}
	.action-btn:hover {
		background: #fdfdfd;
		border-color: #999;
	}
	.action-claim {
		background: #f7c900; /* Orange/Yellow per image */
		border-color: #f7c900;
		color: #fff;
	}
	.action-claim:hover {
		background: #f0c000;
		border-color: #f0c000;
	}

	/* Footer Tabs + Write Review */
	.entry-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 32px;
	}
	.entry-tabs {
		display: flex;
		gap: 40px;
	}
	.tab-item {
		background: none;
		border: none;
		border-bottom: 3px solid transparent;
		cursor: pointer;
		padding: 18px 0;
		font-family: "Roboto", sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #4088cc;
		text-decoration: none;
		transition: all 0.2s;
	}
	.tab-item:hover {
		color: #2d1b69;
	}
	.tab-item.active {
		border-bottom-color: #4088cc;
		color: #2d1b69;
	}

	.fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.btn-write-review {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: #4088cc;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-family: "Roboto", sans-serif;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
		transition: background 0.2s;
	}
	.btn-write-review:hover {
		background: #3573ab;
	}

	/* Tab Content */
	.tab-content {
		padding: 40px 32px;
		background: #fff;
	}
	.empty-msg {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #999;
		margin: 0;
	}

	@media (max-width: 768px) {
		.entry-header {
			flex-direction: column;
			gap: 24px;
			padding: 24px;
		}
		.entry-logo-wrap {
			width: 100%;
			align-items: center;
		}
		.entry-logo-img {
			max-width: 200px;
		}
		.entry-actions {
			padding: 16px 24px;
		}
		.entry-footer {
			flex-direction: column;
			padding: 0 24px;
			align-items: flex-start;
		}
		.entry-tabs {
			width: 100%;
			gap: 20px;
			overflow-x: auto;
		}
		.btn-write-review {
			margin: 16px 0;
			width: 100%;
			justify-content: center;
		}
		.entry-desc {
			padding: 24px;
		}
	}
</style>
