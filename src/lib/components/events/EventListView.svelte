<script lang="ts">
	import type { GartenEvent } from '$lib/types/index.js';
	import EventCard from './EventCard.svelte';
	import { getGermanMonth } from '$lib/utils/date.js';

	interface Props {
		events: GartenEvent[];
		showPast?: boolean;
	}
	let { events, showPast = false }: Props = $props();

	// Group events by month
	const grouped = $derived(() => {
		const map = new Map<string, GartenEvent[]>();
		for (const e of events) {
			const key = `${e.startDate.getFullYear()}-${String(e.startDate.getMonth() + 1).padStart(2, '0')}`;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(e);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
	});

	function monthLabel(key: string): string {
		const [year, month] = key.split('-');
		const d = new Date(parseInt(year), parseInt(month) - 1, 1);
		return `${getGermanMonth(d)} ${year}`;
	}
</script>

<div class="event-list">
	{#if events.length === 0}
		<div class="empty-state">
			<p>Aktuell keine {showPast ? 'vergangenen ' : ''}Veranstaltungen.</p>
		</div>
	{:else}
		{#each grouped() as [key, groupEvents]}
			<div class="month-group">
				<h2 class="month-heading">{monthLabel(key)}</h2>
				<div class="events-stack">
					{#each groupEvents as event}
						<EventCard {event} />
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.event-list {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.month-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.month-heading {
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 900;
		color: var(--color-primary);
		margin: 0;
		padding-bottom: 10px;
		border-bottom: 3px solid var(--color-accent);
		display: inline-block;
	}

	.events-stack {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.empty-state {
		text-align: center;
		padding: 48px 0;
		color: var(--color-text-muted);
		font-family: var(--font-body);
		font-size: 15px;
	}
</style>
