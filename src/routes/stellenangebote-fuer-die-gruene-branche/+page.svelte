<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';

	const crumbs = [{ label: 'Stellenangebote für die grüne Branche' }];

	const JOB_TYPES = [
		'Flexible 60-100%',
		'Freelance',
		'Teilzeit 10-50%',
		'Teilzeit 50-80%',
		'Teilzeit 50%',
		'Teilzeit 80%',
		'Vollzeit 100%',
		'Vollzeit 80-100%'
	];

	let keyword = $state('');
	let location = $state('');
	let selectedTypes = $state(new Set(JOB_TYPES));
	let searched = $state(false);

	function toggleType(type: string) {
		const next = new Set(selectedTypes);
		if (next.has(type)) next.delete(type);
		else next.add(type);
		selectedTypes = next;
	}

	function search() {
		searched = true;
	}

	function reset() {
		keyword = '';
		location = '';
		selectedTypes = new Set(JOB_TYPES);
		searched = false;
	}
</script>

<svelte:head>
	<title>Stellenangebote für die grüne Branche | Gartenwoche</title>
	<meta name="description" content="Stellenangebote in der Gartenbranche – Gärtnerei, Landschaftsbau, Baumschulen und mehr in der Schweiz." />
</svelte:head>

<div class="jobs-page">
	<div class="container">
		<Breadcrumb crumbs={crumbs} />

		<h1 class="page-title">Stellenangebote in der grünen Branche</h1>

		<!-- Search form -->
		<div class="search-box">
			<div class="search-inputs">
				<input
					type="text"
					bind:value={keyword}
					placeholder="Volltext"
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
			<button class="search-btn" onclick={search} type="button">
				Jobs suchen
			</button>
		</div>

		<!-- Employment type checkboxes -->
		<div class="type-filters" role="group" aria-label="Beschäftigungsart">
			{#each JOB_TYPES as type}
				<label class="type-check">
					<input
						type="checkbox"
						checked={selectedTypes.has(type)}
						onchange={() => toggleType(type)}
					/>
					{type}
				</label>
			{/each}
		</div>

		<!-- Results bar -->
		<div class="results-bar">
			<span class="results-count">
				Suche abgeschlossen. 0 passende Einträge gefunden.
			</span>
			<div class="results-actions">
				<a href="/stellenangebote-fuer-die-gruene-branche/rss" class="action-link">RSS</a>
				<button class="action-link" onclick={reset} type="button">Zurücksetzen</button>
			</div>
		</div>

		<!-- Empty state -->
		<div class="empty-state">
			<p>Es gibt keine Einträge, die Ihrer Suche entsprechen.</p>
		</div>

		<!-- Post a job CTA -->
		<div class="post-job">
			<p>Möchten Sie eine Stelle ausschreiben?</p>
			<a href="/schreiben-sie-uns" class="post-link">Stellenangebot aufgeben →</a>
		</div>
	</div>
</div>

<style>
	.jobs-page {
		padding: 24px 0 60px;
		background: #fff;
	}

	.page-title {
		font-family: 'Open Sans', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #222;
		margin: 0 0 20px;
	}

	/* Search box */
	.search-box {
		border: 1px solid #ccc;
		margin-bottom: 0;
	}

	.search-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.search-input {
		padding: 10px 14px;
		border: none;
		border-right: 1px solid #ccc;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		background: #fff;
		outline: none;
		width: 100%;
	}

	.search-input:last-child {
		border-right: none;
	}

	.search-input::placeholder {
		color: #aaa;
	}

	.search-btn {
		display: block;
		width: 100%;
		padding: 11px;
		background: #1a1a1a;
		color: #fff;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		font-weight: 700;
		border: none;
		cursor: pointer;
		text-align: center;
		transition: background 0.15s;
	}

	.search-btn:hover {
		background: #333;
	}

	/* Type filters */
	.type-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		padding: 12px 0;
		border-bottom: 1px solid #E0E0E0;
		margin-bottom: 10px;
	}

	.type-check {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #333;
		cursor: pointer;
		white-space: nowrap;
	}

	.type-check input[type="checkbox"] {
		accent-color: #2D6A4F;
		width: 14px;
		height: 14px;
		cursor: pointer;
	}

	/* Results bar */
	.results-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid #E0E0E0;
		margin-bottom: 16px;
	}

	.results-count {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
	}

	.results-actions {
		display: flex;
		gap: 12px;
	}

	.action-link {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #5a9e3a;
		text-decoration: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.action-link:hover {
		text-decoration: underline;
	}

	/* Empty state */
	.empty-state {
		padding: 12px 0 24px;
	}

	.empty-state p {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		font-style: italic;
		color: #5a9e3a;
		margin: 0;
	}

	/* Post job */
	.post-job {
		margin-top: 40px;
		padding-top: 24px;
		border-top: 1px solid #E0E0E0;
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.post-job p {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #555;
		margin: 0;
	}

	.post-link {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		font-weight: 700;
		color: #5a9e3a;
		text-decoration: none;
	}

	.post-link:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 600px) {
		.search-inputs {
			grid-template-columns: 1fr;
		}
		.search-input {
			border-right: none;
			border-bottom: 1px solid #ccc;
		}
		.type-filters {
			gap: 6px 12px;
		}
		.results-bar {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
		}
	}
</style>
