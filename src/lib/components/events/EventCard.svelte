<script lang="ts">
	import type { GartenEvent } from '$lib/types/index.js';
	import { formatGermanDateRange, getGermanMonthShort } from '$lib/utils/date.js';

	interface Props {
		event: GartenEvent;
	}
	let { event }: Props = $props();
</script>

<a href="/veranstaltung/{event.slug}" class="event-card">
	<div class="event-date-col">
		<div class="event-badge">
			<span class="badge-day">{event.startDate.getDate()}</span>
			<span class="badge-month">{getGermanMonthShort(event.startDate)}</span>
		</div>
	</div>

	<div class="event-thumb">
		{#if event.thumbnail}
			<img src={event.thumbnail} alt={event.title} loading="lazy" width="120" height="80" />
		{:else}
			<div class="thumb-placeholder"></div>
		{/if}
	</div>

	<div class="event-info">
		<h3 class="event-title">{event.title}</h3>
		<div class="event-meta">
			<span class="event-location">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
					<circle cx="12" cy="10" r="3" />
				</svg>
				{event.city || event.location}
				{#if event.country && event.country !== 'Schweiz'}
					, {event.country}
				{/if}
			</span>
			<span class="event-dates">
				{formatGermanDateRange(event.startDate, event.endDate)}
			</span>
		</div>
		{#if event.organizer}
			<span class="event-organizer">Veranstalter: {event.organizer}</span>
		{/if}
	</div>

	<div class="event-arrow">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
			<polyline points="9 18 15 12 9 6" />
		</svg>
	</div>
</a>

<style>
	.event-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.event-card:hover {
		box-shadow: 0 4px 16px rgba(45, 27, 105, 0.1);
		border-color: var(--color-primary);
		transform: translateY(-1px);
	}

	.event-date-col {
		flex-shrink: 0;
	}

	.event-badge {
		background: var(--color-primary);
		color: #fff;
		width: 54px;
		height: 54px;
		border-radius: var(--radius-sm);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		line-height: 1;
		gap: 2px;
	}

	.badge-day {
		font-family: var(--font-heading);
		font-size: 22px;
		font-weight: 900;
	}

	.badge-month {
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.event-thumb {
		flex-shrink: 0;
		width: 120px;
		height: 80px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.event-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumb-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #e0e0e0, #ececec);
	}

	.event-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.event-title {
		font-family: var(--font-heading);
		font-size: 16px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.3;
	}

	.event-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.event-location,
	.event-dates {
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
	}

	.event-organizer {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-faint);
	}

	.event-arrow {
		flex-shrink: 0;
		color: var(--color-text-faint);
		transition: color 0.2s ease;
	}

	.event-card:hover .event-arrow {
		color: var(--color-primary);
	}

	@media (max-width: 599px) {
		.event-thumb {
			display: none;
		}
	}
</style>
