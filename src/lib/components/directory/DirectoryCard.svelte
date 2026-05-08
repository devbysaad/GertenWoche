<script lang="ts">
	import type { DirectoryEntry } from '$lib/types/index.js';

	interface Props {
		entry: DirectoryEntry;
	}
	let { entry }: Props = $props();

	function getInitials(name: string): string {
		return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
	}
</script>

<a href="/branchenverzeichnis/eintrag/{entry.slug}" class="dir-card card-hover">
	<div class="dir-logo">
		{#if entry.logo}
			<img src={entry.logo} alt="{entry.name} Logo" loading="lazy" width="100" height="60" />
		{:else}
			<div class="dir-initials">{getInitials(entry.name)}</div>
		{/if}
	</div>

	<div class="dir-body">
		<h3 class="dir-name">{entry.name}</h3>
		{#if entry.category}
			<span class="cat-badge dir-badge">{entry.category}</span>
		{/if}
		{#if entry.city}
			<p class="dir-location">
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
					<circle cx="12" cy="10" r="3" />
				</svg>
				{entry.city}
			</p>
		{/if}
		{#if entry.description}
			<p class="dir-desc">{entry.description}</p>
		{/if}
	</div>
</a>

<style>
	.dir-card {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.dir-card:hover {
		box-shadow: 0 4px 16px rgba(45, 27, 105, 0.1);
		border-color: var(--color-primary);
	}

	.dir-logo {
		height: 100px;
		background: var(--color-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		border-bottom: 1px solid var(--color-border);
	}

	.dir-logo img {
		max-width: 100%;
		max-height: 68px;
		object-fit: contain;
	}

	.dir-initials {
		width: 72px;
		height: 60px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 22px;
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
	}

	.dir-body {
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	.dir-name {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.2;
	}

	.dir-badge {
		font-size: 10px;
		align-self: flex-start;
	}

	.dir-location {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-muted);
		margin: 0;
	}

	.dir-desc {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
