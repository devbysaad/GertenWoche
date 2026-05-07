<script lang="ts">
	import type { GartenEvent } from '$lib/types/index.js';
	import { formatGermanDateRange, getGermanMonthShort } from '$lib/utils/date.js';

	interface Props {
		events: GartenEvent[];
	}
	let { events }: Props = $props();
</script>

<section class="events-widget">
	<div class="events-header">
		<h2 class="section-heading">Veranstaltungen</h2>
		<a href="/veranstaltungen" class="events-all">Alle anzeigen →</a>
	</div>

	{#if events.length === 0}
		<p class="events-empty">Aktuell keine Veranstaltungen eingetragen.</p>
	{:else}
		<div class="events-list">
			{#each events.slice(0, 4) as event}
				<a href="/veranstaltung/{event.slug}" class="event-item">
					<div class="event-date-badge">
						<span class="event-day">{event.startDate.getDate()}</span>
						<span class="event-month">{getGermanMonthShort(event.startDate)}</span>
					</div>
					<div class="event-info">
						<h3 class="event-title">{event.title}</h3>
						<span class="event-location">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							{event.city || event.location}
						</span>
						<span class="event-range">{formatGermanDateRange(event.startDate, event.endDate)}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>

<style>
	.events-widget {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 16px;
	}

	.events-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.events-all {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}

	.events-all:hover {
		opacity: 0.75;
		color: var(--color-primary);
	}

	.events-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.event-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-border);
		text-decoration: none;
		transition: background 0.15s ease;
		border-radius: var(--radius-sm);
	}

	.event-item:last-child {
		border-bottom: none;
	}

	.event-item:hover {
		background: var(--color-bg);
		padding-left: 8px;
		padding-right: 8px;
		margin: 0 -8px;
	}

	.event-date-badge {
		flex-shrink: 0;
		background: var(--color-primary);
		color: #fff;
		width: 44px;
		height: 44px;
		border-radius: var(--radius-sm);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.event-day {
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 900;
	}

	.event-month {
		font-family: var(--font-heading);
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.event-info {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.event-title {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.event-location {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--color-text-muted);
	}

	.event-range {
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--color-text-faint);
	}

	.events-empty {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
		text-align: center;
		padding: 16px 0;
		margin: 0;
	}
</style>
