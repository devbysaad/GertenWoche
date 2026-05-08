<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		currentPage: number;
		totalPages: number;
		totalArticles?: number;
	}
	let { currentPage, totalPages, totalArticles }: Props = $props();

	function pageHref(p: number): string {
		const params = new URLSearchParams($page.url.searchParams);
		if (p === 1) {
			params.delete('page');
		} else {
			params.set('page', String(p));
		}
		const qs = params.toString();
		return $page.url.pathname + (qs ? `?${qs}` : '');
	}

	const visiblePages = $derived(() => {
		if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
		const pages: (number | '...')[] = [1];
		if (currentPage > 3) pages.push('...');
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			pages.push(i);
		}
		if (currentPage < totalPages - 2) pages.push('...');
		pages.push(totalPages);
		return pages;
	});
</script>

{#if totalPages > 1}
<nav class="gw-pagination" aria-label="Seitennavigation">
	<div class="gw-page-row">

		{#if currentPage > 1}
			<a href={pageHref(currentPage - 1)} class="gw-arrow" rel="prev">← Zurück</a>
		{/if}

		<div class="gw-numbers">
			{#each visiblePages() as p}
				{#if p === '...'}
					<span class="gw-ellipsis">…</span>
				{:else}
					<a
						href={pageHref(p)}
						class="gw-num"
						class:gw-current={p === currentPage}
						aria-label={`Seite ${p}`}
						aria-current={p === currentPage ? 'page' : undefined}
					>{p}</a>
				{/if}
			{/each}
		</div>

		{#if currentPage < totalPages}
			<a href={pageHref(currentPage + 1)} class="gw-arrow" rel="next">Vor →</a>
		{/if}

	</div>
	<p class="gw-page-info">Seite {currentPage} von {totalPages}</p>
</nav>
{/if}

<style>
	/* All classes are prefixed gw- to avoid Tailwind conflicts */

	.gw-pagination {
		margin-top: 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.gw-page-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* ── Arrow links: plain text, #2D1B69, no box ── */
	.gw-arrow {
		/* Hard reset all box-model that Tailwind/browser might add */
		display: inline !important;
		background: none !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		padding: 0 !important;
		margin: 0 !important;
		outline: none;
		/* Typography */
		font-family: 'Roboto', sans-serif !important;
		font-size: 13px !important;
		font-weight: 400 !important;
		color: #2D1B69 !important;
		text-decoration: none !important;
		line-height: 1 !important;
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.gw-arrow:hover {
		opacity: 0.7;
		color: #2D1B69 !important;
	}

	.gw-numbers {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* ── Page number links: plain text, no box ── */
	.gw-num {
		/* Hard reset */
		display: inline !important;
		background: none !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		padding: 0 !important;
		margin: 0 !important;
		/* Typography */
		font-family: 'Roboto', sans-serif !important;
		font-size: 13px !important;
		font-weight: 400 !important;
		color: #555555 !important;
		text-decoration: none !important;
		line-height: 1 !important;
		cursor: pointer;
		transition: color 0.15s;
	}
	.gw-num:hover {
		color: #2D1B69 !important;
	}

	/* Current page: purple + bold, not clickable */
	.gw-num.gw-current {
		color: #2D1B69 !important;
		font-weight: 700 !important;
		pointer-events: none;
		cursor: default;
	}

	.gw-ellipsis {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #999999;
		line-height: 1;
	}

	/* "Seite X von Y": Open Sans 12px, #999, centered */
	.gw-page-info {
		font-family: 'Open Sans', sans-serif !important;
		font-size: 12px !important;
		color: #999999 !important;
		margin: 0 !important;
		text-align: center;
		background: none !important;
		border: none !important;
		padding: 0 !important;
	}
</style>
