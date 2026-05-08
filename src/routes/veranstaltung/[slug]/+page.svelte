<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import CalendarExport from '$lib/components/events/CalendarExport.svelte';
	import { formatGermanDateRange } from '$lib/utils/date.js';

	let { data } = $props();
	const { event } = $derived(data);

	const crumbs = $derived([
		{ label: 'Veranstaltungen', href: '/veranstaltungen' },
		{ label: event.title }
	]);
</script>

<svelte:head>
	<title>{event.title} | Veranstaltungen | Gartenwoche</title>
	<meta name="description" content="{event.title} — {event.city}, {formatGermanDateRange(event.startDate, event.endDate)}" />
</svelte:head>

<div class="event-detail-page">
	<div class="container">
		<Breadcrumb crumbs={crumbs} />

		<div class="event-layout">
			<main class="event-main">
				<header class="event-header">
					<div class="event-date-block">
						<span class="date-label">Datum</span>
						<span class="date-value">{formatGermanDateRange(event.startDate, event.endDate)}</span>
					</div>
					<h1 class="event-title">{event.title}</h1>
				</header>

				{#if event.thumbnail}
					<img src={event.thumbnail} alt={event.title} class="event-img" loading="eager" width="800" height="450" />
				{/if}

				<div class="prose event-desc">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html event.description}
				</div>

				<CalendarExport {event} />
			</main>

			<aside class="event-sidebar">
				<div class="sidebar-card">
					<h2 class="sidebar-heading">Details</h2>
					<dl class="event-details">
						{#if event.organizer}
							<dt>Veranstalter</dt>
							<dd>{event.organizer}</dd>
						{/if}
						{#if event.location}
							<dt>Ort</dt>
							<dd>{event.location}</dd>
						{/if}
						{#if event.city}
							<dt>Stadt</dt>
							<dd>{event.city}</dd>
						{/if}
						{#if event.country}
							<dt>Land</dt>
							<dd>{event.country}</dd>
						{/if}
						{#if event.website}
							<dt>Website</dt>
							<dd><a href={event.website} target="_blank" rel="noopener noreferrer" class="ext-link">{event.website}</a></dd>
						{/if}
					</dl>
				</div>
			</aside>
		</div>
	</div>
</div>

<style>
	.event-detail-page {
		padding: 24px 0 48px;
	}

	.event-layout {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 32px;
		align-items: start;
		margin-top: 12px;
	}

	.event-main {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.event-header {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.event-date-block {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.date-label {
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-faint);
	}

	.date-value {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-primary);
	}

	.event-title {
		font-family: var(--font-heading);
		font-size: clamp(24px, 3vw, 34px);
		font-weight: 900;
		color: var(--color-text);
		margin: 0;
		line-height: 1.2;
	}

	.event-img {
		width: 100%;
		border-radius: var(--radius-md);
		display: block;
	}

	.event-desc {
		font-family: var(--font-body);
		font-size: 16px;
		line-height: 1.8;
		color: var(--color-text);
	}

	.event-desc :global(p) {
		margin-bottom: 1.2em;
	}

	/* Sidebar */
	.event-sidebar {
		position: sticky;
		top: calc(var(--header-height) + 16px);
	}

	.sidebar-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 18px;
	}

	.sidebar-heading {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		margin-bottom: 14px;
	}

	.event-details {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 10px 8px;
		font-family: var(--font-body);
		font-size: 13px;
	}

	.event-details dt {
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		font-size: 11px;
		letter-spacing: 0.04em;
		display: flex;
		align-items: flex-start;
		padding-top: 2px;
	}

	.event-details dd {
		color: var(--color-text);
		margin: 0;
	}

	.ext-link {
		color: var(--color-primary);
		word-break: break-all;
		font-size: 12px;
	}

	@media (max-width: 1023px) {
		.event-layout {
			grid-template-columns: 1fr;
		}

		.event-sidebar {
			position: static;
		}
	}
</style>
