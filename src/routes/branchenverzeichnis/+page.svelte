<script lang="ts">
	let { data } = $props();

	let q = $state("");
	let loc = $state("");
	let sort = $state("newest");
	let showFilters = $state(false);

	const sortOptions = [
		{ id: "newest", label: "Newest First" },
		{ id: "oldest", label: "Oldest First" },
		{ id: "title", label: "Title" },
		{ id: "random", label: "Random" },
		{ id: "reviews", label: "Most Reviews" },
		{ id: "rated", label: "Highest Rated" },
		{ id: "claimed", label: "Claimed" },
		{ id: "unclaimed", label: "Unclaimed" },
	];
</script>

<svelte:head>
	<title>Branchenverzeichnis | Gartenwoche</title>
</svelte:head>

<div class="dir-page">
	<div class="container">
		<!-- Header -->
		<div class="dir-header">
			<h1 class="dir-title">Branchenverzeichnis</h1>
			<a href="/schreiben-sie-uns" class="btn-add">+ Eintrag hinzufügen</a
			>
		</div>

		<!-- New Complex Search Bar -->
		<div class="dir-search-container">
			<div class="search-main-bar">
				<div class="input-group search-q">
					<input type="text" placeholder="Search..." bind:value={q} />
				</div>
				<div class="input-group search-loc">
					<input
						type="text"
						placeholder="Enter a location"
						bind:value={loc}
					/>
					<button class="radius-btn" title="Search radius">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="3" /><path
								d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
							/>
						</svg>
					</button>
				</div>
				<button class="search-submit-btn" aria-label="Suchen">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<circle cx="11" cy="11" r="8" /><line
							x1="21"
							y1="21"
							x2="16.65"
							y2="16.65"
						/>
					</svg>
				</button>
			</div>

			<div class="search-sub-bar">
				<button
					class="filter-btn"
					onclick={() => (showFilters = !showFilters)}
				>
					Filter
				</button>
				<div class="sort-dropdown">
					<span class="sort-label">Sort by:</span>
					<select bind:value={sort}>
						{#each sortOptions as opt}
							<option value={opt.id}>{opt.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Directory list -->
		{#if data.entries.length === 0}
			<div class="empty-state">
				<p>Keine Einträge gefunden.</p>
			</div>
		{:else}
			<div class="dir-grid">
				{#each data.entries as entry}
					<div class="dir-card">
						<a
							href="/branchenverzeichnis/eintrag/{entry.slug}"
							class="card-link-overlay"
							aria-label="{entry.name} ansehen"
						></a>
						<div class="card-logo">
							{#if entry.logo && entry.logo.trim() !== ""}
								<img
									src={entry.logo}
									alt={entry.name}
									loading="lazy"
								/>
							{:else}
								<div class="card-logo-ph">
									<span>No Image</span>
								</div>
							{/if}
						</div>
						<div class="card-content">
							<h2 class="card-name">{entry.name}</h2>
							<div class="card-contact">
								{#if entry.address || entry.city}
									<p class="contact-line">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											><path
												d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
											/><circle
												cx="12"
												cy="10"
												r="3"
											/></svg
										>
										{[
											entry.address,
											entry.zip,
											entry.city,
											entry.country,
										]
											.filter(Boolean)
											.join(", ")}
									</p>
								{/if}
							</div>
							{#if entry.description}
								<div class="card-desc">{entry.description}</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.dir-page {
		padding: 24px 0 48px;
		background: #fdfdfd;
	}
	.dir-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}
	.dir-title {
		font-family: "Roboto", sans-serif;
		font-size: 28px;
		font-weight: 900;
		text-transform: uppercase;
		color: #222;
	}
	.btn-add {
		background: #5a9e3a;
		color: #fff;
		padding: 10px 16px;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 700;
		font-size: 14px;
	}

	/* Search Bar UI */
	.dir-search-container {
		margin-bottom: 32px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.search-main-bar {
		display: flex;
		align-items: stretch;
		border: 1px solid #d1d1d1;
		border-radius: 4px;
		background: #fff;
		overflow: hidden;
	}
	.input-group {
		display: flex;
		align-items: center;
		padding: 0 16px;
		flex: 1;
	}
	.search-q {
		border-right: 1px solid #eee;
	}
	.search-loc {
		position: relative;
	}
	.input-group input {
		width: 100%;
		border: none;
		outline: none;
		padding: 12px 0;
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #333;
	}
	.radius-btn {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		transition: color 0.15s;
	}
	.radius-btn:hover {
		color: #000;
	}
	.search-submit-btn {
		background: #4088cc;
		color: #fff;
		border: none;
		padding: 0 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		transition: background 0.15s;
	}
	.search-submit-btn:hover {
		background: #3573ab;
	}

	.search-sub-bar {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.filter-btn {
		padding: 8px 16px;
		border: 1px solid #d1d1d1;
		background: #fff;
		border-radius: 3px;
		font-size: 13px;
		color: #444;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s;
	}
	.filter-btn:hover {
		background: #f5f5f5;
	}
	.sort-dropdown {
		display: flex;
		align-items: center;
		gap: 6px;
		border: 1px solid #d1d1d1;
		background: #fff;
		border-radius: 3px;
		padding: 0 8px;
	}
	.sort-label {
		font-size: 13px;
		color: #666;
		font-weight: 600;
	}
	.sort-dropdown select {
		border: none;
		outline: none;
		background: none;
		padding: 8px 0;
		font-size: 13px;
		font-weight: 700;
		color: #000;
		cursor: pointer;
	}

	/* Column Masonry Grid */
	.dir-grid {
		column-count: 3;
		column-gap: 24px;
	}
	.dir-card {
		break-inside: avoid;
		margin-bottom: 24px;
		position: relative;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		display: block; /* Important for masonry */
	}
	.dir-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	}
	.card-link-overlay {
		position: absolute;
		inset: 0;
		z-index: 2;
	}
	.card-logo {
		width: 100%;
		height: auto;
		min-height: 120px;
		max-height: 200px;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid #eee;
		padding: 20px;
		overflow: hidden;
	}
	.card-logo img {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}
	.card-logo-ph {
		color: #ccc;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
	}
	.card-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.card-name {
		font-family: "Roboto", sans-serif;
		font-size: 17px;
		font-weight: 900;
		color: #111;
		margin: 0;
		line-height: 1.3;
	}
	.contact-line {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		font-size: 12px;
		color: #666;
		margin: 0;
		line-height: 1.4;
	}
	.contact-line svg {
		flex-shrink: 0;
		margin-top: 2px;
		color: #aaa;
	}
	.card-desc {
		font-size: 13px;
		color: #444;
		line-height: 1.6;
		margin: 0;
		white-space: pre-wrap; /* Keeps some formatting if available */
	}

	@media (max-width: 992px) {
		.dir-grid {
			column-count: 2;
		}
	}

	@media (max-width: 768px) {
		.dir-grid {
			column-count: 1;
		}
		.search-main-bar {
			flex-direction: column;
		}
		.search-q {
			border-right: none;
			border-bottom: 1px solid #eee;
		}
		.search-submit-btn {
			padding: 14px;
			justify-content: center;
		}
		.dir-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
	}
</style>
