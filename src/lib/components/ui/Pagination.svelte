<script lang="ts">
	import { page } from "$app/stores";

	interface Props {
		currentPage: number;
		totalPages: number;
		totalArticles?: number;
	}
	let { currentPage, totalPages, totalArticles }: Props = $props();

	function pageHref(p: number): string {
		const params = new URLSearchParams($page.url.searchParams);
		if (p === 1) {
			params.delete("page");
		} else {
			params.set("page", String(p));
		}
		const qs = params.toString();
		return $page.url.pathname + (qs ? `?${qs}` : "");
	}

	const visiblePages = $derived(() => {
		if (totalPages <= 7)
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		const pages: (number | "...")[] = [1];
		if (currentPage > 3) pages.push("...");
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			pages.push(i);
		}
		if (currentPage < totalPages - 2) pages.push("...");
		pages.push(totalPages);
		return pages;
	});
</script>

{#if totalPages > 1}
	<nav class="gw-pagination" aria-label="Seitennavigation">
		<div class="gw-page-row">
			{#if currentPage > 1}
				<a
					href={pageHref(currentPage - 1)}
					class="gw-nav-btn gw-arrow"
					rel="prev"
					aria-label="Zurück"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polyline points="15 18 9 12 15 6"></polyline></svg
					>
				</a>
			{/if}

			<div class="gw-numbers">
				{#each visiblePages() as p}
					{#if p === "..."}
						<span class="gw-ellipsis">…</span>
					{:else}
						<a
							href={pageHref(p)}
							class="gw-nav-btn gw-num"
							class:gw-current={p === currentPage}
							aria-label={`Seite ${p}`}
							aria-current={p === currentPage
								? "page"
								: undefined}>{p}</a
						>
					{/if}
				{/each}
			</div>

			{#if currentPage < totalPages}
				<a
					href={pageHref(currentPage + 1)}
					class="gw-nav-btn gw-arrow"
					rel="next"
					aria-label="Vor"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><polyline points="9 18 15 12 9 6"></polyline></svg
					>
				</a>
			{/if}
		</div>
		<p class="gw-page-info">Seite {currentPage} von {totalPages}</p>
	</nav>
{/if}

<style>
	.gw-pagination {
		margin: 40px 0 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.gw-page-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.gw-numbers {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.gw-nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		background: #ffffff;
		border: 1px solid #e0e0e0;
		color: #555;
		text-decoration: none;
		font-family: "Roboto", sans-serif;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s;
		cursor: pointer;
	}

	.gw-nav-btn:hover {
		border-color: #7a5200;
		color: #7a5200;
	}

	.gw-current {
		background: #7a5200 !important;
		border-color: #7a5200 !important;
		color: #ffffff !important;
		pointer-events: none;
	}

	.gw-ellipsis {
		width: 30px;
		text-align: center;
		color: #999;
		font-family: "Roboto", sans-serif;
	}

	.gw-page-info {
		font-family: "Open Sans", sans-serif;
		font-size: 12px;
		color: #999;
		margin: 0;
	}
</style>
