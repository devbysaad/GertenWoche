<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchStore } from '$lib/stores/search.store.js';
	import { onMount } from 'svelte';

	let isOpen = $derived($searchStore);

	let query   = $state('');
	let results = $state<Array<{ title: string; href: string; category: string }>>([]);
	let inputEl: HTMLInputElement | undefined;
	let debounce: ReturnType<typeof setTimeout>;

	// Focus input when opened
	$effect(() => {
		if (isOpen && inputEl) {
			setTimeout(() => inputEl?.focus(), 40);
		}
	});

	// ESC closes
	onMount(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') closeOverlay();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function closeOverlay() {
		searchStore.close();
		query   = '';
		results = [];
	}

	// Live search — debounced, max 6 results
	function onInput() {
		clearTimeout(debounce);
		if (!query.trim()) { results = []; return; }
		debounce = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://gartenwoche.ch/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=6&_embed`,
					{ signal: AbortSignal.timeout(4000) }
				);
				if (!res.ok) { results = []; return; }
				const posts = await res.json();
				results = posts.map((p: Record<string, unknown>) => ({
					title:    (p.title as Record<string, string>)?.rendered?.replace(/<[^>]+>/g, '') ?? '',
					href:     (p.link as string)?.replace('https://gartenwoche.ch', '') ?? '/',
					category: ((p._embedded as Record<string, unknown>)?.['wp:term'] as unknown[])?.[0] as string ?? '',
				}));
			} catch {
				results = [];
			}
		}, 280);
	}

	function submit() {
		const q = query.trim();
		if (q) goto(`/search?q=${encodeURIComponent(q)}`);
		closeOverlay();
	}
</script>

{#if isOpen}
	<!-- Full-screen dark overlay — rgba(0,0,0,0.92) per spec -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="so-overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Suche"
		onclick={(e) => { if (e.target === e.currentTarget) closeOverlay(); }}
	>
		<!-- Logo top-left (white version via CSS filter) -->
		<div class="so-top">
			<a href="/" class="so-logo" onclick={closeOverlay} aria-label="Gartenwoche – Startseite">
				<img src="/Logo_Gartenwoche-1.png" alt="Gartenwoche" class="so-logo-img" />
			</a>
			<button class="so-close" onclick={closeOverlay} aria-label="Suche schließen">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
					<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			</button>
		</div>

		<!-- Search input row: border-bottom only, no box border -->
		<div class="so-body">
			<form class="so-form" onsubmit={(e) => { e.preventDefault(); submit(); }}>
				<input
					bind:this={inputEl}
					bind:value={query}
					oninput={onInput}
					type="search"
					class="so-input"
					placeholder="type here..."
					autocomplete="off"
					spellcheck="false"
				/>
				<!-- "Suche" button: bg #222, white text Roboto 14px -->
				<button type="submit" class="so-btn">Suche</button>
			</form>

			<!-- Live results: max 6 items -->
			{#if results.length > 0}
				<ul class="so-results">
					{#each results as r}
						<li>
							<a
								href={r.href}
								class="so-result-link"
								onclick={closeOverlay}
							>
								{#if r.category}
									<span class="so-result-cat">{r.category}</span>
								{/if}
								<span class="so-result-title">{r.title}</span>
							</a>
						</li>
					{/each}
				</ul>
			{:else if query.trim().length > 1}
				<p class="so-empty">Keine Ergebnisse für „{query}"</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Full-screen dark overlay */
	.so-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.92);
		display: flex;
		flex-direction: column;
	}

	/* Top bar: logo left + close button right */
	.so-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 32px;
		flex-shrink: 0;
	}

	/* Logo — white filter to make it visible on dark bg */
	.so-logo-img {
		height: 40px;
		width: auto;
		display: block;
		filter: brightness(0) invert(1);
		opacity: 0.9;
	}

	.so-close {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		padding: 6px;
		display: flex;
		align-items: center;
		transition: color 0.15s;
	}
	.so-close:hover { color: #fff; }

	/* Body — search row + results */
	.so-body {
		flex: 1;
		max-width: 700px;
		width: 100%;
		margin: 0 auto;
		padding: 0 32px 40px;
	}

	/* Input row: border-bottom ONLY, no box border */
	.so-form {
		display: flex;
		align-items: center;
		border-bottom: 2px solid rgba(255, 255, 255, 0.5);
		margin-bottom: 24px;
	}

	/* Input: large font 24px, white text, no border/outline */
	.so-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 24px;
		color: #fff;
		padding: 12px 0;
		min-width: 0;
		/* Hide default search clear button */
		-webkit-appearance: none;
	}
	.so-input::placeholder {
		color: rgba(255, 255, 255, 0.35);
	}
	.so-input::-webkit-search-cancel-button { display: none; }

	/* "Suche" button: bg #222, white Roboto 14px */
	.so-btn {
		flex-shrink: 0;
		background: #222;
		color: #fff;
		border: none;
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 14px;
		font-weight: 700;
		padding: 10px 20px;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
		margin-left: 12px;
	}
	.so-btn:hover { background: #333; }

	/* Results list: max 6 items */
	.so-results {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.so-result-link {
		display: flex;
		align-items: baseline;
		gap: 10px;
		padding: 10px 0;
		text-decoration: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		transition: opacity 0.15s;
	}
	.so-result-link:hover { opacity: 0.75; }

	.so-result-cat {
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent, #F7C900);
		flex-shrink: 0;
	}

	.so-result-title {
		font-family: var(--font-heading, 'Roboto', sans-serif);
		font-size: 15px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.so-empty {
		font-family: var(--font-body, 'Open Sans', sans-serif);
		font-size: 14px;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
		padding: 12px 0;
	}

	/* Mobile */
	@media (max-width: 640px) {
		.so-top  { padding: 16px 20px; }
		.so-body { padding: 0 20px 32px; }
		.so-input { font-size: 18px; }
	}
</style>
