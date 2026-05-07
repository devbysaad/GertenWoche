<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		baseUrl: string; // e.g. "/category/pflanzen"
	}
	let { currentPage, totalPages, baseUrl }: Props = $props();

	function pageUrl(p: number) {
		return p === 1 ? baseUrl : `${baseUrl}?page=${p}`;
	}

	const pages = $derived(() => {
		const arr: (number | '...')[] = [];
		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
				arr.push(i);
			} else if (arr[arr.length - 1] !== '...') {
				arr.push('...');
			}
		}
		return arr;
	});
</script>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Seitennavigation">
		{#if currentPage > 1}
			<a href={pageUrl(currentPage - 1)} class="page-btn prev" aria-label="Vorherige Seite">
				← Vorherige
			</a>
		{/if}

		<div class="page-numbers">
			{#each pages() as p}
				{#if p === '...'}
					<span class="page-ellipsis">…</span>
				{:else}
					<a
						href={pageUrl(p)}
						class="page-num"
						class:active={p === currentPage}
						aria-current={p === currentPage ? 'page' : undefined}
					>
						{p}
					</a>
				{/if}
			{/each}
		</div>

		{#if currentPage < totalPages}
			<a href={pageUrl(currentPage + 1)} class="page-btn next" aria-label="Nächste Seite">
				Nächste →
			</a>
		{/if}
	</nav>
{/if}

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 32px;
		flex-wrap: wrap;
	}

	.page-btn {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-primary);
		border: 1px solid var(--color-border);
		padding: 8px 14px;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.page-btn:hover {
		background: var(--color-primary);
		color: #fff;
		border-color: var(--color-primary);
	}

	.page-numbers {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.page-num {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		transition: all 0.2s ease;
	}

	.page-num:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.page-num.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: #fff;
	}

	.page-ellipsis {
		font-size: 14px;
		color: var(--color-text-faint);
		padding: 0 4px;
	}
</style>
