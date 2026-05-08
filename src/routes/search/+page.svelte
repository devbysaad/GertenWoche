<script lang="ts">
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let q = $state(data.q);
	let inputEl = $state<HTMLInputElement | null>(null);

	function onSubmit(e: Event) {
		e.preventDefault();
		if (q.trim()) goto(`/search?q=${encodeURIComponent(q.trim())}`);
	}
</script>

<svelte:head>
	<title>{data.q ? `Suche: ${data.q} | Gartenwoche` : 'Suche | Gartenwoche'}</title>
	<meta name="description" content="Suchergebnisse für &quot;{data.q}&quot; auf Gartenwoche." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="search-page">
	<div class="container">
		<h1 class="page-title">Suche</h1>

		<form class="search-form" onsubmit={onSubmit}>
			<div class="search-input-wrap">
				<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					bind:this={inputEl}
					bind:value={q}
					type="search"
					placeholder="Was suchen Sie?"
					class="search-input"
					aria-label="Suchbegriff"
					autocomplete="off"
					autofocus
				/>
			</div>
			<button type="submit" class="search-btn">Suchen</button>
		</form>

		{#if data.q}
			<div class="search-meta">
				{#if data.results.length > 0}
					<p class="result-count">
						<strong>{data.results.length}</strong> Ergebnisse für „{data.q}"
					</p>
				{:else}
					<p class="result-count no-result">
						Keine Ergebnisse für „{data.q}"
					</p>
					<p class="search-tip">Tipp: Probieren Sie kürzere Suchbegriffe oder überprüfen Sie die Rechtschreibung.</p>
				{/if}
			</div>

			{#if data.results.length > 0}
				<div class="results-grid">
					{#each data.results as article}
						<ArticleCard {article} />
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.search-page {
		padding: 32px 0 48px;
	}

	.page-title {
		font-family: var(--font-heading);
		font-size: 32px;
		font-weight: 900;
		margin-bottom: 24px;
		border-left: 4px solid var(--color-accent);
		padding-left: 12px;
	}

	.search-form {
		display: flex;
		gap: 10px;
		max-width: 700px;
		margin-bottom: 32px;
	}

	.search-input-wrap {
		position: relative;
		flex: 1;
	}

	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-faint);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 12px 14px 12px 44px;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-heading);
		font-size: 18px;
		background: var(--color-surface);
		color: var(--color-text);
		transition: border-color 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.search-btn {
		padding: 12px 28px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.2s ease;
	}

	.search-btn:hover {
		background: var(--color-primary-hover);
	}

	.search-meta {
		margin-bottom: 24px;
	}

	.result-count {
		font-family: var(--font-heading);
		font-size: 16px;
		color: var(--color-text);
		margin: 0 0 4px;
	}

	.no-result {
		color: var(--color-text-muted);
	}

	.search-tip {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-faint);
		margin: 0;
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	@media (max-width: 1023px) {
		.results-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 599px) {
		.results-grid { grid-template-columns: 1fr; }
		.search-form { flex-direction: column; }
	}
</style>
