<script lang="ts">
	import EventListView from '$lib/components/events/EventListView.svelte';
	import EventMonthView from '$lib/components/events/EventMonthView.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	let activeView = $state('list');
	let calYear = $state(new Date().getFullYear());
	let calMonth = $state(new Date().getMonth());
	let showPast = $state(false);
	$effect(() => { activeView = data.view === 'calendar' ? 'calendar' : 'list'; });

	function switchView(v: string) {
		activeView = v;
		goto(`?view=${v}`, { replaceState: true, keepFocus: true });
	}

	function handleNavigate(y: number, m: number) {
		calYear = y;
		calMonth = m;
	}
</script>

<svelte:head>
	<title>Veranstaltungen | Gartenwoche</title>
	<meta name="description" content="Alle Gartenmessen, Ausstellungen und Veranstaltungen in der Schweiz und Europa – Gartenwoche Veranstaltungskalender." />
	<link rel="canonical" href="https://gartenwoche.ch/veranstaltungen" />
</svelte:head>

<div class="events-page">
	<div class="container">
		<div class="events-header">
			<h1 class="page-title">Veranstaltungen</h1>
			<div class="view-toggle" role="group" aria-label="Ansicht wählen">
				<button
					class="toggle-btn"
					class:active={activeView === 'list'}
					onclick={() => switchView('list')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
					Liste
				</button>
				<button
					class="toggle-btn"
					class:active={activeView === 'calendar'}
					onclick={() => switchView('calendar')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
					Kalender
				</button>
			</div>
		</div>

		{#if activeView === 'calendar'}
			<EventMonthView
				events={data.upcoming}
				year={calYear}
				month={calMonth}
				onNavigate={handleNavigate}
			/>
		{:else}
			<!-- List tabs: upcoming / past -->
			<div class="list-tabs">
				<button class="tab-btn" class:active={!showPast} onclick={() => (showPast = false)}>
					Kommende ({data.upcoming.length})
				</button>
				<button class="tab-btn" class:active={showPast} onclick={() => (showPast = true)}>
					Vergangene ({data.past.length})
				</button>
			</div>

			<EventListView events={showPast ? data.past : data.upcoming} showPast={showPast} />
		{/if}
	</div>
</div>

<style>
	.events-page {
		padding: 24px 0 48px;
	}

	.events-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 28px;
		flex-wrap: wrap;
	}

	.page-title {
		font-family: var(--font-heading);
		font-size: 32px;
		font-weight: 900;
		color: var(--color-text);
		margin: 0;
		border-left: 4px solid var(--color-accent);
		padding-left: 12px;
	}

	.view-toggle {
		display: flex;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		background: var(--color-surface);
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		transition: all 0.15s ease;
	}

	.toggle-btn.active {
		background: var(--color-primary);
		color: #fff;
	}

	.toggle-btn:hover:not(.active) {
		background: var(--color-bg);
	}

	.list-tabs {
		display: flex;
		gap: 0;
		margin-bottom: 24px;
		border-bottom: 2px solid var(--color-border);
	}

	.tab-btn {
		padding: 10px 20px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 700;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all 0.2s ease;
	}

	.tab-btn.active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}
</style>
