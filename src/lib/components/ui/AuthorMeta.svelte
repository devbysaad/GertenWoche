<script lang="ts">
	import type { Author } from '$lib/types/index.js';
	import { formatGermanDate } from '$lib/utils/date.js';

	interface Props {
		author: Author;
		publishedAt: Date;
		light?: boolean;
		noLink?: boolean;
	}
	let { author, publishedAt, light = false, noLink = false }: Props = $props();

	const dateStr = $derived(formatGermanDate(publishedAt));
</script>

<div class="author-meta" class:light>
	<span>Von </span>
	{#if noLink}
		<span class="author-name">{author.name}</span>
	{:else}
		<a href="/author/{author.slug}" class="author-name" onclick={(e) => e.stopPropagation()}>
			{author.name}
		</a>
	{/if}
	<span class="sep">·</span>
	<time datetime={publishedAt instanceof Date ? publishedAt.toISOString() : publishedAt}>
		{dateStr}
	</time>
</div>

<style>
	.author-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 3px;
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-muted);
	}

	.author-meta.light {
		color: rgba(255, 255, 255, 0.8);
	}

	.author-name {
		font-weight: 600;
		color: inherit;
		transition: color 0.2s ease;
	}

	.author-name:hover {
		color: var(--color-accent);
	}

	.light .author-name:hover {
		color: var(--color-accent);
	}

	.sep {
		color: var(--color-text-faint);
		margin: 0 2px;
	}

	time {
		color: inherit;
	}
</style>
