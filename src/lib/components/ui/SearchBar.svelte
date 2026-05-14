<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';
	import { searchStore } from '$lib/stores/search.store.js';
	import { goto } from '$app/navigation';
	import type { ArticlePreview } from '$lib/types/index.js';

	interface Props {
		open: boolean;
	}
	let { open }: Props = $props();

	let query = $state('');
	let results = $state<ArticlePreview[]>([]);
	let loading = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Focus input on open
	$effect(() => {
		if (open && inputEl) {
			setTimeout(() => inputEl?.focus(), 50);
		}
		if (!open) {
			query = '';
			results = [];
		}
	});

	// ESC to close
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape' && open) modalStore.closeSearch();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	async function onInput() {
		clearTimeout(debounceTimer);
		const q = query.trim();
		if (!q) {
			results = [];
			loading = false;
			return;
		}
		loading = true;
		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
				if (res.ok) results = await res.json();
			} catch {
				results = [];
			} finally {
				loading = false;
			}
		}, 300);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && query.trim()) {
			modalStore.closeSearch();
			goto(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	}

	function highlight(text: string, q: string): string {
		if (!q) return text;
		const escaped = q.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&');
		return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
	}
</script>

{#if open}
	<div
		class="search-overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Suche"
	>
		<!-- Close -->
		<button
			class="search-close"
			onclick={() => modalStore.closeSearch()}
			aria-label="Suche schließen"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<div class="search-content">
			<!-- Input -->
			<div class="search-input-wrap">
				<input
					bind:this={inputEl}
					bind:value={query}
					oninput={onInput}
					onkeydown={onKeydown}
					type="search"
					placeholder="Suche eingeben…"
					class="search-input"
					aria-label="Suchbegriff eingeben"
					autocomplete="off"
				/>
				<button
					class="search-submit"
					type="button"
					onclick={() => {
						modalStore.closeSearch();
					}}
					aria-label="Suche ausführen"
				>
					Suche →
				</button>
			</div>

			<!-- Results -->
			{#if query.trim()}
				<div class="search-results" role="listbox">
					{#if results.length === 0 && !loading}
						<p class="search-empty">
							Keine Ergebnisse gefunden für „{query}"
						</p>
					{:else}
						{#each results as article}
							<a
								href={`/${article.urlPath}`}
								class="search-result"
								role="option"
								aria-selected="false"
								onclick={() => modalStore.closeSearch()}
							>
								{#if article.thumbnail}
									<img
										src={article.thumbnail}
										alt={article.title}
										class="result-thumb"
										width="50"
										height="50"
										loading="lazy"
									/>
								{:else}
									<div class="result-thumb-placeholder"></div>
								{/if}
								<div class="result-text">
									<span class="cat-badge result-badge"
										>{article.category.name}</span
									>
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									<span class="result-title"
										>{@html highlight(
											article.title,
											query,
										)}</span
									>
								</div>
							</a>
						{/each}

						{#if results.length > 0}
							<a
								href="/search?q={encodeURIComponent(query)}"
								class="search-all"
								onclick={() => modalStore.closeSearch()}
							>
								Alle Ergebnisse für „{query}" anzeigen →
							</a>
						{/if}
					{/if}
				</div>
			{/if}

			<p class="search-hint">
				Drücken Sie <kbd>Enter</kbd> für alle Ergebnisse ·
				<kbd>Esc</kbd> zum Schließen
			</p>
		</div>
	</div>
{/if}

<style>
	.search-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.92);
		z-index: 400;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: min(18vh, 120px);
		padding-left: 20px;
		padding-right: 20px;
		animation: fadeIn 0.18s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.search-close {
		position: absolute;
		top: 20px;
		right: 24px;
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.55);
		transition: color 0.2s ease;
		padding: 4px;
		z-index: 1;
	}

	.search-close:hover {
		color: #fff;
	}

	.search-content {
		width: 100%;
		max-width: 700px;
	}

	.search-input-wrap {
		display: flex;
		align-items: center;
		gap: 0;
		border-bottom: 2px solid rgba(255, 255, 255, 0.5);
		padding-bottom: 10px;
		margin-bottom: 24px;
	}

	.search-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-family: "Roboto", sans-serif;
		font-size: 24px;
		font-weight: 400;
		color: #ffffff;
		caret-color: #f7c900;
		-webkit-appearance: none;
	}

	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.35);
	}

	.search-submit {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #222;
		border: none;
		color: #fff;
		font-family: "Roboto", sans-serif;
		font-size: 14px;
		font-weight: 600;
		padding: 8px 16px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s;
		flex-shrink: 0;
	}

	.search-submit:hover {
		background: #333;
	}

	.search-results {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.search-result {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 10px 12px;
		border-radius: var(--radius-md);
		transition: background 0.15s ease;
		text-decoration: none;
	}

	.search-result:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.result-thumb {
		width: 50px;
		height: 50px;
		object-fit: cover;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.result-thumb-placeholder {
		width: 50px;
		height: 50px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.result-text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.result-badge {
		font-size: 10px;
		align-self: flex-start;
	}

	.result-title {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 600;
		color: #fff;
		line-height: 1.3;
	}

	:global(.result-title mark) {
		background: var(--color-accent);
		color: var(--color-primary);
		border-radius: 2px;
		padding: 0 2px;
	}

	.search-empty {
		font-family: var(--font-heading);
		font-size: 16px;
		color: rgba(255, 255, 255, 0.5);
		text-align: center;
		padding: 20px;
		margin: 0;
	}

	.search-all {
		display: block;
		text-align: center;
		padding: 12px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-accent);
		margin-top: 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		transition: opacity 0.2s ease;
	}

	.search-all:hover {
		opacity: 0.8;
		color: var(--color-accent);
	}

	.search-hint {
		font-family: var(--font-heading);
		font-size: 12px;
		color: rgba(255, 255, 255, 0.3);
		text-align: center;
		margin-top: 20px;
	}

	kbd {
		background: rgba(255, 255, 255, 0.1);
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 11px;
		font-family: monospace;
	}
</style>
