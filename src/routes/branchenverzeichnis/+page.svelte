<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();

	let q = $state(data.search ?? '');
	let cat = $state(data.catFilter ?? '');
	let alpha = $state(data.alphaFilter ?? '');
	let debounce: ReturnType<typeof setTimeout>;

	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function navigate() {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			const params = new URLSearchParams();
			if (q) params.set('q', q);
			if (cat) params.set('cat', cat);
			if (alpha) params.set('alpha', alpha);
			goto(`?${params.toString()}`, { replaceState: true, keepFocus: true });
		}, 300);
	}

	function setAlpha(letter: string) {
		alpha = alpha === letter ? '' : letter;
		navigate();
	}
</script>

<svelte:head>
	<title>Branchenverzeichnis | Gartenwoche</title>
	<meta name="description" content="Das Branchenverzeichnis von Gartenwoche – Schweizer Gartenbau-Unternehmen, Baumschulen, Gärtnereien und Garten-Dienstleister." />
	<link rel="canonical" href="https://gartenwoche.ch/branchenverzeichnis" />
</svelte:head>

<div class="dir-page">
	<div class="container">

		<!-- Header -->
		<div class="dir-header">
			<h1 class="dir-title">Branchenverzeichnis</h1>
			<a href="/schreiben-sie-uns" class="btn-add">+ Eintrag hinzufügen</a>
		</div>

		<!-- Search + Category filter -->
		<div class="dir-filters">
			<div class="search-wrap">
				<svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
				</svg>
				<input
					bind:value={q}
					oninput={navigate}
					type="search"
					placeholder="Firma, Stadt, Stichwort..."
					class="dir-search"
					aria-label="Verzeichnis durchsuchen"
				/>
			</div>
			<select bind:value={cat} onchange={navigate} class="cat-select" aria-label="Kategorie filtern">
				<option value="">Alle Kategorien</option>
				{#each data.categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<!-- Alphabet filter -->
		<div class="alpha-strip" aria-label="Alphabetische Filterung">
			<button
				class="alpha-btn"
				class:active={!alpha}
				onclick={() => setAlpha('')}
			>Alle</button>
			{#each ALPHABET as letter}
				<button
					class="alpha-btn"
					class:active={alpha === letter}
					onclick={() => setAlpha(letter)}
				>{letter}</button>
			{/each}
		</div>

		<!-- Results count -->
		<p class="dir-count">
			{data.entries.length} von {data.allEntries.length} Einträgen
		</p>

		<!-- Directory list -->
		{#if data.entries.length === 0}
			<div class="empty-state">
				<p>Keine Einträge gefunden.</p>
			</div>
		{:else}
			<div class="dir-grid">
				{#each data.entries as entry}
					<div class="dir-card">
						<a href="/branchenverzeichnis/eintrag/{entry.slug}" class="card-link-overlay" aria-label="Eintrag ansehen"></a>
						
						<!-- Logo -->
						<div class="card-logo">
							{#if entry.logo && entry.logo.trim() !== ''}
								<img src={entry.logo} alt={entry.name} loading="lazy" />
							{:else}
								<div class="card-logo-ph">
									<span>No Image</span>
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="card-content">
							<h2 class="card-name">{entry.name}</h2>

							<div class="card-contact">
								{#if entry.address || entry.city}
									<p class="contact-line">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
										{[entry.address, entry.zip, entry.city, entry.country].filter(Boolean).join(', ')}
									</p>
								{/if}
								{#if entry.phone && entry.phone.length > 0}
									<p class="contact-line">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
										{entry.phone[0]}
									</p>
								{/if}
								{#if entry.email}
									<p class="contact-line">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
										{entry.email}
									</p>
								{/if}
								{#if entry.website}
									<p class="contact-line website-line">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
										{entry.website}
									</p>
								{/if}
							</div>

							{#if entry.description}
								<div class="card-desc">
									{entry.description}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

	</div>
</div>

<style>
	.dir-page { padding: 24px 0 48px; background: #f7f7f7; }

	/* Header */
	.dir-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		flex-wrap: wrap;
		gap: 12px;
	}
	.dir-title {
		font-family: 'Roboto', sans-serif;
		font-size: 28px;
		font-weight: 900;
		text-transform: uppercase;
		color: #222;
		margin: 0;
		letter-spacing: 0.02em;
	}
	.btn-add {
		display: inline-block;
		background: #5a9e3a;
		color: white;
		padding: 8px 16px;
		border-radius: 3px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 700;
		text-decoration: none;
	}
	.btn-add:hover { background: #4a8c2e; }

	/* Filters */
	.dir-filters {
		display: flex;
		gap: 10px;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}
	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 240px;
	}
	.search-icon {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		pointer-events: none;
	}
	.dir-search {
		width: 100%;
		padding: 8px 10px 8px 34px;
		border: 1px solid #D0D0D0;
		border-radius: 3px;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		background: #fff;
		color: #222;
	}
	.dir-search:focus { outline: none; border-color: #2D1B69; }
	.cat-select {
		padding: 8px 12px;
		border: 1px solid #D0D0D0;
		border-radius: 3px;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		background: #fff;
		color: #222;
		cursor: pointer;
		min-width: 180px;
	}
	.cat-select:focus { outline: none; border-color: #2D1B69; }

	/* Alphabet strip */
	.alpha-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-bottom: 16px;
	}
	.alpha-btn {
		padding: 4px 8px;
		border: 1px solid #D0D0D0;
		background: #fff;
		color: #555;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		border-radius: 2px;
		transition: all 0.15s;
		min-width: 28px;
		text-align: center;
	}
	.alpha-btn:hover { border-color: #2D1B69; color: #2D1B69; }
	.alpha-btn.active { background: #2D1B69; color: #fff; border-color: #2D1B69; }

	/* Count */
	.dir-count {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #888;
		margin: 0 0 12px;
	}

	/* Grid Layout */
	.dir-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	/* Card styling */
	.dir-card {
		background: #fff;
		border: 1px solid #E0E0E0;
		position: relative;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.2s, border-color 0.2s;
	}

	.dir-card:hover {
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
		border-color: #5a9e3a;
	}

	.card-link-overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
	}

	/* Logo block */
	.card-logo {
		width: 100%;
		height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		padding: 10px;
		border-bottom: 1px solid #F0F0F0;
	}
	.card-logo img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.card-logo-ph {
		width: 100%;
		height: 100%;
		background: #EBEBEB;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.card-logo-ph span {
		font-family: 'Open Sans', sans-serif;
		font-size: 24px;
		font-weight: 600;
		color: #FFF;
	}

	/* Content block */
	.card-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-name {
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #5a9e3a; /* Green title as seen in screenshot */
		margin: 0 0 12px;
		line-height: 1.3;
	}

	.card-contact {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.contact-line {
		font-family: 'Open Sans', sans-serif;
		font-size: 11px;
		color: #333;
		margin: 0;
		display: flex;
		align-items: flex-start;
		gap: 8px;
		line-height: 1.4;
	}

	.contact-line svg {
		flex-shrink: 0;
		color: #555;
		margin-top: 1px;
	}

	.website-line {
		color: #5a9e3a;
	}

	/* Description */
	.card-desc {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		line-height: 1.5;
		color: #444;
		margin-top: auto; /* Push to bottom if content is short, or let it flow naturally */
		display: -webkit-box;
		-webkit-line-clamp: 10;
		line-clamp: 10;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty-state {
		background: #fff;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		padding: 48px;
		text-align: center;
		font-family: 'Open Sans', sans-serif;
		color: #888;
	}

	/* Responsive */
	@media (max-width: 991px) {
		.dir-grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 599px) {
		.dir-header { flex-direction: column; align-items: flex-start; }
		.alpha-strip { gap: 1px; }
		.alpha-btn { padding: 3px 6px; font-size: 11px; min-width: 24px; }
		
		.dir-grid { grid-template-columns: 1fr; }
	}
</style>
