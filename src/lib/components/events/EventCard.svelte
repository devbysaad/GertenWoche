<script lang="ts">
	import type { GartenEvent } from "$lib/types/index.js";
	import { formatGermanDateRange } from "$lib/utils/date.js";

	const DAYS = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

	interface Props {
		event: GartenEvent;
	}
	let { event }: Props = $props();

	// Normalize dates — SSR may deserialize Date objects as ISO strings
	const startDate = $derived(event.startDate instanceof Date ? event.startDate : new Date(event.startDate as unknown as string));
	const endDate   = $derived(event.endDate   instanceof Date ? event.endDate   : new Date(event.endDate   as unknown as string));

	const dayName   = $derived(DAYS[startDate.getDay()]);
	const dayNum    = $derived(startDate.getDate());
	const dateRange = $derived(formatGermanDateRange(startDate, endDate));

	// Truncate description to ~250 chars
	const excerpt = $derived(() => {
		if (!event.description) return '';
		const text = event.description.replace(/<[^>]+>/g, '');
		return text.length > 260 ? text.slice(0, 257) + ' [...]' : text;
	});
</script>

<article class="ev-row">
	<!-- Left: day number -->
	<div class="ev-date-col">
		<span class="ev-dayname">{dayName}</span>
		<span class="ev-daynum">{dayNum}</span>
	</div>

	<!-- Middle: content -->
	<div class="ev-content">
		<p class="ev-range">{dateRange}</p>
		<h3 class="ev-title">
			<a href="/veranstaltung/{event.slug}">{event.title}</a>
		</h3>
		{#if event.city || event.location}
			<p class="ev-loc">
				<strong>{event.city || event.location}</strong>
				{#if event.address}, {event.address}{/if}
				{#if event.country && event.country !== 'Schweiz'},{event.country}{/if}
			</p>
		{/if}
		{#if excerpt()}
			<p class="ev-desc">{excerpt()}</p>
		{/if}
	</div>

	<!-- Right: image -->
	{#if event.thumbnail}
		<div class="ev-img-col">
			<a href="/veranstaltung/{event.slug}" tabindex="-1" aria-hidden="true">
				<img src={event.thumbnail} alt={event.title} loading="lazy" />
			</a>
		</div>
	{/if}
</article>

<style>
	.ev-row {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 24px;
		padding: 24px 0;
		border-top: 1px solid #E0E0E0;
		align-items: start;
	}

	/* Date column */
	.ev-date-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 2px;
	}

	.ev-dayname {
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		font-weight: 400;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.ev-daynum {
		font-family: 'Open Sans', sans-serif;
		font-size: 36px;
		font-weight: 300;
		color: #222;
		line-height: 1;
		margin-top: 2px;
	}

	/* Content */
	.ev-content { min-width: 0; }

	.ev-range {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #888;
		margin: 0 0 4px;
	}

	.ev-title {
		font-family: 'Open Sans', sans-serif;
		font-size: 19px;
		font-weight: 700;
		color: #222;
		margin: 0 0 8px;
		line-height: 1.3;
	}

	.ev-title a {
		text-decoration: none;
		color: inherit;
	}

	.ev-title a:hover {
		color: #4F46E5;
	}

	.ev-loc {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		margin: 0 0 10px;
	}

	.ev-desc {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: #555;
		margin: 0;
	}

	/* Image */
	.ev-img-col {
		width: 160px;
		flex-shrink: 0;
	}

	.ev-img-col img {
		display: block;
		width: 160px;
		height: 120px;
		object-fit: cover;
	}

	@media (max-width: 700px) {
		.ev-row {
			grid-template-columns: 48px 1fr;
		}
		.ev-img-col {
			display: none;
		}
	}
</style>
