<script lang="ts">
	import type { JobListing } from "$lib/types/index.js";
	import Breadcrumb from "$lib/components/layout/Breadcrumb.svelte";

	let { data } = $props();

	const crumbs = [{ label: "Stellenangebote für die grüne Branche" }];

	const JOB_TYPES = [
		"Flexible 60-100%",
		"Freelance",
		"Teilzeit 10-50%",
		"Teilzeit 50-80%",
		"Teilzeit 50%",
		"Teilzeit 80%",
		"Vollzeit 100%",
		"Vollzeit 80-100%",
	];

	// Client-side filter state (pre-populated from server filter)
	let keyword = $state(data.filter.keyword);
	let location = $state(data.filter.location);
	let selectedTypes = $state<string[]>([]);

	// Live-filter the server-side results on the client
	const filtered = $derived(
		data.jobs.filter((job: JobListing) => {
			const kw = keyword.toLowerCase();
			const loc = location.toLowerCase();
			const matchKw =
				!kw ||
				job.title.toLowerCase().includes(kw) ||
				job.company.toLowerCase().includes(kw);
			const matchLoc = !loc || job.location.toLowerCase().includes(loc);
			const matchType =
				selectedTypes.length === 0 || selectedTypes.includes(job.type);
			return matchKw && matchLoc && matchType;
		}),
	);

	function reset() {
		keyword = "";
		location = "";
		selectedTypes = [];
	}

	function formatDate(d: Date): string {
		return new Date(d).toLocaleDateString("de-CH", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}
</script>

<svelte:head>
	<title>Stellenangebote für die grüne Branche | Gartenwoche</title>
	<meta
		name="description"
		content="Stellenangebote in der Gartenbranche – Gärtnerei, Landschaftsbau, Baumschulen und mehr in der Schweiz."
	/>
</svelte:head>

<div class="jobs-page">
	<div class="container">
		<Breadcrumb {crumbs} />
		<h1 class="page-title">Stellenangebote in der grünen Branche</h1>

		<!-- Search form -->
		<div class="search-box">
			<div class="search-inputs">
				<input
					type="text"
					bind:value={keyword}
					placeholder="Volltext (Stellentitel, Firma…)"
					class="search-input"
					aria-label="Stichwort"
				/>
				<input
					type="text"
					bind:value={location}
					placeholder="Ort"
					class="search-input"
					aria-label="Ort"
				/>
			</div>
			<button class="search-btn" type="button">Jobs suchen</button>
		</div>

		<!-- Employment type filters (checkboxes) -->
		<div class="type-filters" role="group" aria-label="Beschäftigungsart">
			{#each JOB_TYPES as type}
				<label class="type-check">
					<input
						type="checkbox"
						value={type}
						bind:group={selectedTypes}
					/>
					{type}
				</label>
			{/each}
			<a href="/feed/jobs" class="rss-link" target="_blank" rel="noopener"
				>RSS</a
			>
		</div>

		<!-- Results bar -->
		<div class="results-bar">
			<span class="results-count">
				{filtered.length}
				{filtered.length === 1 ? "Eintrag" : "Einträge"} gefunden
			</span>
			<div class="results-actions">
				<button class="action-link" onclick={reset} type="button"
					>Zurücksetzen</button
				>
			</div>
		</div>

		<!-- Job listings -->
		<!-- No results -->
		{#if filtered.length === 0}
			<div class="empty-state">
				<p style="color:#0073aa">
					There are no listings matching your search.
				</p>
			</div>
		{:else}
			<div class="jobs-list">
				{#each filtered as job}
					<a
						href={job.url}
						target="_blank"
						rel="noopener noreferrer"
						class="job-card"
					>
						<!-- Logo -->
						<div class="job-logo">
							{#if job.logo}
								<img
									src={job.logo}
									alt={job.company}
									width="56"
									height="56"
								/>
							{:else}
								<div class="logo-placeholder">
									{job.company.charAt(0).toUpperCase()}
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="job-body">
							<div class="job-top">
								<h2 class="job-title">{job.title}</h2>
								<span class="job-type-badge">{job.type}</span>
							</div>
							<div class="job-meta">
								<span class="job-company">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										><rect
											x="2"
											y="7"
											width="20"
											height="14"
											rx="2"
										/><path
											d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
										/></svg
									>
									{job.company}
								</span>
								{#if job.location}
									<span class="job-location">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											><path
												d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
											/><circle
												cx="12"
												cy="10"
												r="3"
											/></svg
										>
										{job.location}
									</span>
								{/if}
								<span class="job-date">
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										><rect
											x="3"
											y="4"
											width="18"
											height="18"
											rx="2"
										/><line
											x1="16"
											y1="2"
											x2="16"
											y2="6"
										/><line
											x1="8"
											y1="2"
											x2="8"
											y2="6"
										/><line
											x1="3"
											y1="10"
											x2="21"
											y2="10"
										/></svg
									>
									{formatDate(job.postedAt)}
								</span>
							</div>
							{#if job.excerpt}
								<p class="job-excerpt">{job.excerpt}</p>
							{/if}
						</div>

						<!-- CTA -->
						<div class="job-cta">
							<span class="apply-btn">Bewerben →</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Post a job CTA -->
		<div class="post-job">
			<p>Möchten Sie eine Stelle ausschreiben?</p>
			<a href="/schreiben-sie-uns" class="post-link"
				>Stellenangebot aufgeben →</a
			>
		</div>
	</div>
</div>

<style>
	.jobs-page {
		padding: 24px 0 60px;
		background: #fff;
	}

	.page-title {
		font-family: "Open Sans", sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #222;
		margin: 0 0 20px;
	}

	/* ── Search ── */
	.search-box {
		border: 1px solid #ccc;
		margin-bottom: 16px;
		padding: 12px;
		background: #fafafa;
		border-radius: 4px;
	}

	.search-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 12px;
	}

	.search-input {
		padding: 10px 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #333;
		background: #fff;
		outline: none;
		width: 100%;
	}
	.search-input:focus {
		border-color: #5a9e3a;
	}
	.search-input:last-child {
		border-right: inherit;
	}
	.search-input::placeholder {
		color: #aaa;
	}

	.search-btn {
		display: block;
		width: 100%;
		padding: 11px;
		background: #000;
		color: #fff;
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		font-weight: 700;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.search-btn:hover {
		background: #333;
	}

	/* ── Type filters ── */
	.type-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		padding: 14px 0;
		border-bottom: 1px solid #e0e0e0;
		margin-bottom: 16px;
	}

	.type-check {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #333;
		cursor: pointer;
		white-space: nowrap;
	}
	.type-check input[type="checkbox"] {
		accent-color: #0073aa;
		cursor: pointer;
	}

	.rss-link {
		margin-left: auto;
		font-family: "Open Sans", sans-serif;
		font-size: 12px;
		color: #0073aa;
		text-decoration: none;
	}
	.rss-link:hover {
		text-decoration: underline;
	}

	/* ── Results bar ── */
	.results-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid #e0e0e0;
		margin-bottom: 16px;
	}

	.results-count {
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #555;
	}

	.action-link {
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #5a9e3a;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	.action-link:hover {
		text-decoration: underline;
	}

	/* ── Job cards ── */
	.jobs-list {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background: #e0e0e0;
		border: 1px solid #e0e0e0;
	}

	.job-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 20px;
		background: #fff;
		text-decoration: none;
		transition: background 0.15s;
	}
	.job-card:hover {
		background: #fafafa;
	}

	.job-logo {
		flex-shrink: 0;
		width: 56px;
		height: 56px;
	}
	.job-logo img {
		width: 56px;
		height: 56px;
		object-fit: contain;
		border: 1px solid #e8e8e8;
		border-radius: 4px;
		background: #fff;
		padding: 4px;
	}
	.logo-placeholder {
		width: 56px;
		height: 56px;
		background: #e8f5e9;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: "Roboto", sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #5a9e3a;
	}

	.job-body {
		flex: 1;
		min-width: 0;
	}

	.job-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 6px;
	}

	.job-title {
		font-family: "Roboto", sans-serif;
		font-size: 15px;
		font-weight: 700;
		color: #222;
		margin: 0;
		line-height: 1.3;
	}
	.job-card:hover .job-title {
		color: #5a9e3a;
	}

	.job-type-badge {
		flex-shrink: 0;
		font-family: "Roboto", sans-serif;
		font-size: 11px;
		font-weight: 600;
		color: #555;
		background: #f0f0f0;
		padding: 2px 8px;
		border-radius: 2px;
		white-space: nowrap;
	}

	.job-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 4px;
	}

	.job-company,
	.job-location,
	.job-date {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: "Open Sans", sans-serif;
		font-size: 12px;
		color: #666;
	}

	.job-excerpt {
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #555;
		margin: 4px 0 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.job-cta {
		flex-shrink: 0;
	}
	.apply-btn {
		font-family: "Roboto", sans-serif;
		font-size: 12px;
		font-weight: 700;
		color: #5a9e3a;
		white-space: nowrap;
	}

	/* ── Empty state ── */
	.empty-state {
		padding: 32px 0;
		text-align: center;
	}
	.empty-state p {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #888;
		margin: 0;
	}

	/* ── Post job CTA ── */
	.post-job {
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid #e0e0e0;
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.post-job p {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #555;
		margin: 0;
	}
	.post-link {
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #5a9e3a;
		text-decoration: none;
	}
	.post-link:hover {
		text-decoration: underline;
	}

	/* ── Responsive ── */
	@media (max-width: 700px) {
		.search-inputs {
			grid-template-columns: 1fr;
		}
		.search-input {
			border-right: none;
			border-bottom: 1px solid #ccc;
		}
		.job-card {
			flex-wrap: wrap;
		}
		.job-cta {
			display: none;
		}
		.job-top {
			flex-direction: column;
		}
	}
</style>
