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

	.gw-arrow {
		display: inline !important;
		background: none !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		padding: 0 !important;
		margin: 0 !important;
		outline: none;
		font-family: 'Roboto', sans-serif !important;
		font-size: 13px !important;
		font-weight: 400 !important;
		color: #555 !important;
		text-decoration: none !important;
		line-height: 1 !important;
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.gw-arrow:hover {
		color: #222 !important;
	}

	.gw-numbers {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.gw-num {
		display: inline !important;
		background: none !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		padding: 0 !important;
		margin: 0 !important;
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
		color: #222 !important;
	}

	.gw-num.gw-current {
		color: #5a9e3a !important;
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
