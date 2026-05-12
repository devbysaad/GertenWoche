<script lang="ts">
	interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		crumbs: Crumb[];
	}

	let { crumbs }: Props = $props();
</script>

<nav class="breadcrumb" aria-label="Brotkrümelnavigation">
	<ol class="crumb-list">
		<li class="crumb-item">
			<a href="/" class="crumb-link">Start</a>
		</li>
		{#each crumbs as crumb, i}
			<li class="crumb-item">
				<span class="crumb-sep" aria-hidden="true">›</span>
				{#if crumb.href && i < crumbs.length - 1}
					<a href={crumb.href} class="crumb-link">{crumb.label}</a>
				{:else}
					<span class="crumb-current" aria-current="page">{crumb.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.breadcrumb {
		padding: 10px 0;
	}

	.crumb-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.crumb-item {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.crumb-link {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-muted);
		transition: color 0.2s ease;
	}

	.crumb-link:hover {
		color: var(--color-primary);
	}

	.crumb-sep {
		font-size: 12px;
		color: var(--color-text-faint);
	}

	.crumb-current {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text);
		font-weight: 600;
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
