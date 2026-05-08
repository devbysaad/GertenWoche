<script lang="ts">
	import { goto } from '$app/navigation';
	import DirectoryCard from '$lib/components/directory/DirectoryCard.svelte';

	let { data } = $props();

	let q = $state('');
	let cat = $state('');
	$effect(() => {
		q = data.search ?? '';
		cat = data.catFilter ?? '';
	});
	let debounce: ReturnType<typeof setTimeout>;

	function onSearch() {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			const params = new URLSearchParams();
			if (q) params.set('q', q);
			if (cat) params.set('cat', cat);
			goto(`?${params.toString()}`, { replaceState: true, keepFocus: true });
		}, 300);
	}
</script>

<svelte:head>
	<title>Branchenverzeichnis | Gartenwoche</title>
	<meta name="description" content="Das Branchenverzeichnis von Gartenwoche – Schweizer Gartenbau-Unternehmen, Baumschulen, Gärtnereien und Garten-Dienstleister." />
	<link rel="canonical" href="https://gartenwoche.ch/branchenverzeichnis" />
</svelte:head>

<div class="directory-page">
	<div class="container">
		<div class="dir-page-header">
			<h1 class="page-title">Branchenverzeichnis</h1>
			<p class="dir-count">{data.entries.length} von {data.allEntries.length} Einträgen</p>
		</div>

		<!-- Filters -->
		<div class="dir-filters">
			<div class="search-wrap">
				<svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					bind:value={q}
					oninput={onSearch}
					type="search"
					placeholder="Firma, Stadt, Stichwort..."
					class="dir-search"
					aria-label="Verzeichnis durchsuchen"
				/>
			</div>

			<select bind:value={cat} onchange={onSearch} class="cat-select" aria-label="Kategorie filtern">
				<option value="">Alle Kategorien</option>
				{#each data.categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<!-- Grid -->
		{#if data.entries.length === 0}
			<div class="empty-state">
				<p>Keine Einträge gefunden.</p>
			</div>
		{:else}
			<div class="dir-grid">
				{#each data.entries as entry}
					<DirectoryCard {entry} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.directory-page {
		padding: 24px 0 48px;
	}

	.dir-page-header {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 24px;
	}

	.page-title {
		font-family: var(--font-heading);
		font-size: 32px;
		font-weight: 900;
		color: var(--color-text);
		margin: 0;
		border-left: 4px solid var(--color-accent);
		padding-left: 12px;
	}

	.dir-count {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-faint);
		margin: 0;
	}

	.dir-filters {
		display: flex;
		gap: 12px;
		margin-bottom: 28px;
		flex-wrap: wrap;
	}

	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 240px;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-faint);
		pointer-events: none;
	}

	.dir-search {
		width: 100%;
		padding: 10px 12px 10px 38px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 14px;
		background: var(--color-surface);
		color: var(--color-text);
		transition: border-color 0.2s ease;
	}

	.dir-search:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.cat-select {
		padding: 10px 14px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 14px;
		background: var(--color-surface);
		color: var(--color-text);
		cursor: pointer;
		min-width: 200px;
	}

	.cat-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.dir-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
	}

	.empty-state {
		text-align: center;
		padding: 60px;
		color: var(--color-text-muted);
		font-family: var(--font-body);
	}

	@media (max-width: 1023px) {
		.dir-grid { grid-template-columns: repeat(3, 1fr); }
	}

	@media (max-width: 767px) {
		.dir-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 479px) {
		.dir-grid { grid-template-columns: 1fr; }
	}
</style>
