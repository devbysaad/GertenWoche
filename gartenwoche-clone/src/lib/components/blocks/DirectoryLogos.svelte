<script lang="ts">
	import type { DirectoryEntry } from '$lib/types/index.js';

	interface Props {
		entries: DirectoryEntry[];
	}
	let { entries }: Props = $props();

	function getInitials(name: string): string {
		return name
			.split(' ')
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
	}
</script>

<section class="directory-logos">
	<div class="dir-header">
		<h2 class="section-heading">Branchenverzeichnis</h2>
		<a href="/branchenverzeichnis" class="dir-all">Alle anzeigen →</a>
	</div>

	<div class="logos-strip">
		{#each entries as entry}
			<a href="/branchenverzeichnis/eintrag/{entry.slug}" class="logo-item" title={entry.name}>
				{#if entry.logo}
					<img src={entry.logo} alt={entry.name} loading="lazy" width="120" height="60" />
				{:else}
					<div class="logo-initials">
						{getInitials(entry.name)}
					</div>
				{/if}
				<span class="logo-name">{entry.name}</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.directory-logos {
		margin-bottom: 32px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 20px;
	}

	.dir-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.dir-all {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}

	.dir-all:hover {
		opacity: 0.75;
		color: var(--color-primary);
	}

	.logos-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.logo-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 10px 12px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
		text-decoration: none;
		min-width: 110px;
	}

	.logo-item:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(45, 27, 105, 0.12);
	}

	.logo-item img {
		max-width: 100px;
		max-height: 50px;
		object-fit: contain;
	}

	.logo-initials {
		width: 64px;
		height: 40px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
	}

	.logo-name {
		font-family: var(--font-heading);
		font-size: 10px;
		font-weight: 600;
		color: var(--color-text-muted);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100px;
	}
</style>
