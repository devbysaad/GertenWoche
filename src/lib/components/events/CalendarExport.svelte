<script lang="ts">
	import type { GartenEvent } from '$lib/types/index.js';
	import { formatGermanDateRange } from '$lib/utils/date.js';

	interface Props {
		event: GartenEvent;
	}
	let { event }: Props = $props();

	const startIso = $derived(event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z');
	const endIso = $derived(event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z');
	const title = $derived(encodeURIComponent(event.title));
	const location = $derived(encodeURIComponent(event.city || event.location));
	const details = $derived(encodeURIComponent(event.description.replace(/<[^>]*>/g, '')));

	const googleUrl = $derived(
		`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&location=${location}&details=${details}`
	);

	const icalContent = $derived(`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startIso}
DTEND:${endIso}
SUMMARY:${event.title}
LOCATION:${event.city || event.location}
END:VEVENT
END:VCALENDAR`);

	const icalUrl = $derived(
		`data:text/calendar;charset=utf8,${encodeURIComponent(icalContent)}`
	);
</script>

<div class="cal-export">
	<span class="export-label">Zum Kalender hinzufügen:</span>
	<div class="export-btns">
		<a href={googleUrl} target="_blank" rel="noopener noreferrer" class="export-btn google">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
			Google Kalender
		</a>
		<a href={icalUrl} download="{event.slug}.ics" class="export-btn ical">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
			iCal / Apple
		</a>
		<a
			href="https://outlook.office.com/calendar/0/deeplink/compose?subject={title}&startdt={startIso}&enddt={endIso}&location={location}"
			target="_blank"
			rel="noopener noreferrer"
			class="export-btn outlook"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
			Outlook 365
		</a>
		<a
			href="https://outlook.live.com/calendar/0/deeplink/compose?subject={title}&startdt={startIso}&enddt={endIso}&location={location}"
			target="_blank"
			rel="noopener noreferrer"
			class="export-btn outlook"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
			Outlook Live
		</a>
	</div>
</div>

<style>
	.cal-export {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		padding: 16px;
		background: var(--color-bg);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.export-label {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
	}

	.export-btns {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.export-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 20px;
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-text);
		transition: all 0.2s ease;
		text-decoration: none;
		white-space: nowrap;
	}

	.export-btn:hover {
		background: var(--color-primary);
		color: #fff;
		border-color: var(--color-primary);
	}
</style>
