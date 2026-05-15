<script lang="ts">
	import EventListView from '$lib/components/events/EventListView.svelte';
	import EventMonthView from '$lib/components/events/EventMonthView.svelte';
	import EventSearch from '$lib/components/events/EventSearch.svelte';
	import MonthNavigator from '$lib/components/events/MonthNavigator.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// ── Local state ────────────────────────────────────────────
	let searchQuery  = $state(data.search ?? '');
	let activeView   = $state(data.view ?? 'list');
	let calYear      = $state(data.displayYear);
	let calMonth     = $state(data.displayMonth); // 0-indexed

	// ── Filter events client-side by search query ───────────────
	const filtered = $derived(() => {
		const events = data.events ?? [];
		if (!searchQuery.trim()) return events;
		const q = searchQuery.toLowerCase();
		return events.filter(e =>
			e.title.toLowerCase().includes(q) ||
			e.description.replace(/<[^>]+>/g, '').toLowerCase().includes(q) ||
			(e.city ?? '').toLowerCase().includes(q) ||
			(e.location ?? '').toLowerCase().includes(q)
		);
	});

	// ── Navigation: update URL so server reloads events for new month ──
	function handleNavigate(y: number, m: number) {
		calYear  = y;
		calMonth = m;
		const monthStr = `${y}-${String(m + 1).padStart(2, '0')}`;
		goto(`/veranstaltungen?view=${activeView}&month=${monthStr}`, { invalidateAll: true });
	}

	function handleViewChange(v: string) {
		activeView = v;
		const monthStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
		goto(`/veranstaltungen?view=${v}&month=${monthStr}`, { invalidateAll: true });
	}

	function handleSearch(q: string) {
		searchQuery = q;
	}

	// MONTHS for DayView header
	const MONTHS_DE = [
		'Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'
	];

	// ── Day view state ─────────────────────────────────────────
	let selectedDay = $state<Date | null>(null);

	const dayEvents = $derived(() => {
		if (!selectedDay) return filtered();
		const sel = selectedDay;
		return (data.events ?? []).filter(e => {
			const start = new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate());
			const end   = new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate());
			const day   = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate());
			return day >= start && day <= end;
		});
	});

	function selectDay(day: Date) {
		selectedDay = day;
		activeView = 'day';
	}

	function prevDay() {
		if (!selectedDay) return;
		const d = new Date(selectedDay);
		d.setDate(d.getDate() - 1);
		selectedDay = d;
	}

	function nextDay() {
		if (!selectedDay) {
			selectedDay = new Date();
			return;
		}
		const d = new Date(selectedDay);
		d.setDate(d.getDate() + 1);
		selectedDay = d;
	}

	function formatDayLabel(d: Date): string {
		const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
		return `${DAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`;
	}
</script>

<svelte:head>
	<title>Veranstaltungen | Gartenwoche</title>
	<meta name="description" content="Alle Gartenmessen, Ausstellungen und Veranstaltungen in der Schweiz und Europa – Gartenwoche Veranstaltungskalender." />
	<link rel="canonical" href="https://gartenwoche.ch/veranstaltungen" />
</svelte:head>

<div class="events-page">
	<div class="container">

		<!-- Search bar -->
		<EventSearch bind:value={searchQuery} onSearch={handleSearch} />

		<!-- Month navigator + view tabs -->
		<MonthNavigator
			year={calYear}
			month={calMonth}
			view={activeView}
			onNavigate={handleNavigate}
		/>

		<!-- View tab quick-switcher (also in MonthNavigator, but as buttons for JS nav) -->
		<div class="view-switcher">
			{#each [['list', 'Liste'], ['month', 'Monat'], ['day', 'Tag']] as [v, label]}
				<button
					type="button"
					class="vsw-btn"
					class:active={activeView === v}
					onclick={() => handleViewChange(v)}
				>{label}</button>
			{/each}
		</div>

		<hr class="sep-line" />

		<!-- ═══ LIST VIEW ═══ -->
		{#if activeView === 'list'}
			<EventListView events={filtered()} showPast={data.isPastMonth} />

			<!-- Bottom navigation -->
			<div class="ev-bottombar">
				<button class="nav-link" type="button" onclick={() => handleNavigate(
					calMonth === 0 ? calYear - 1 : calYear,
					calMonth === 0 ? 11 : calMonth - 1
				)}>‹ Vorherige Ereignisse</button>
				<button class="nav-link" type="button" onclick={() => handleNavigate(
					calMonth === 11 ? calYear + 1 : calYear,
					calMonth === 11 ? 0 : calMonth + 1
				)}>Nächste Ereignisse ›</button>
			</div>

		<!-- ═══ MONTH VIEW ═══ -->
		{:else if activeView === 'month'}
			<EventMonthView
				events={data.events ?? []}
				year={calYear}
				month={calMonth}
				onNavigate={handleNavigate}
			/>

		<!-- ═══ DAY VIEW ═══ -->
		{:else if activeView === 'day'}
			<div class="day-view">
				<!-- Day navigation header -->
				<div class="day-header">
					<button class="day-nav-btn" type="button" onclick={prevDay} aria-label="Vorheriger Tag">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
					</button>
					<div class="day-label-wrap">
						<span class="day-label">
							{#if selectedDay}
								{formatDayLabel(selectedDay)}
							{:else}
								{MONTHS_DE[calMonth]} {calYear}
							{/if}
						</span>
					</div>
					<button class="day-nav-btn" type="button" onclick={nextDay} aria-label="Nächster Tag">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
					</button>
				</div>

				<!-- Mini month picker for day view -->
				<div class="day-mini-cal">
					<EventMonthView
						events={data.events ?? []}
						year={calYear}
						month={calMonth}
						onNavigate={handleNavigate}
					/>
				</div>

				<!-- Events for selected day -->
				<div class="day-events">
					<h3 class="day-events-title">
						{#if selectedDay}
							Veranstaltungen am {formatDayLabel(selectedDay)}
						{:else}
							Klicken Sie auf einen Tag im Kalender
						{/if}
					</h3>
					{#if dayEvents().length === 0}
						<p class="day-empty">Keine Veranstaltungen für diesen Tag.</p>
					{:else}
						<EventListView events={dayEvents()} showPast={false} />
					{/if}
				</div>
			</div>
		{/if}

		<!-- Subscribe to calendar -->
		<div class="subscribe-wrap">
			<a
				href="https://gartenwoche.ch/veranstaltungen/?ical=1"
				target="_blank"
				rel="noopener noreferrer"
				class="subscribe-btn"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
				Kalender abonnieren
				<span class="caret">∨</span>
			</a>
		</div>

	</div>
</div>

<style>
	.events-page {
		padding: 24px 0 48px;
		background: #fff;
	}

	/* ── View switcher buttons (JS-driven, alongside MonthNavigator links) ── */
	.view-switcher {
		display: flex;
		border: 1px solid #D1D5DB;
		border-radius: 3px;
		overflow: hidden;
		width: fit-content;
		margin-bottom: 16px;
	}

	.vsw-btn {
		padding: 5px 16px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		background: #fff;
		border: none;
		border-right: 1px solid #D1D5DB;
		cursor: pointer;
		transition: background 0.15s, color 0.15s;
	}
	.vsw-btn:last-child { border-right: none; }
	.vsw-btn:hover { background: #F3F4F6; color: #111; }
	.vsw-btn.active { background: #4F46E5; color: #fff; }

	/* ── Separator ── */
	.sep-line {
		border: none;
		border-top: 1px solid #E5E7EB;
		margin: 0 0 24px;
	}

	/* ── Bottom navigation ── */
	.ev-bottombar {
		display: flex;
		justify-content: space-between;
		padding: 20px 0 0;
		border-top: 1px solid #E5E7EB;
		margin-top: 8px;
	}

	.nav-link {
		background: none;
		border: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #6B7280;
		cursor: pointer;
		padding: 0;
		transition: color 0.15s;
	}
	.nav-link:hover { color: #111; }

	/* ── Day view ── */
	.day-view {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.day-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid #E5E7EB;
	}

	.day-nav-btn {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid #D1D5DB;
		border-radius: 3px;
		cursor: pointer;
		color: #555;
		transition: border-color 0.15s, color 0.15s;
		flex-shrink: 0;
	}
	.day-nav-btn:hover { border-color: #6B7280; color: #111; }

	.day-label-wrap { flex: 1; }

	.day-label {
		font-family: 'Open Sans', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #111;
	}

	.day-mini-cal {
		max-width: 420px;
	}

	.day-events-title {
		font-family: 'Open Sans', sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #222;
		margin: 0 0 12px;
	}

	.day-empty {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #9CA3AF;
		font-style: italic;
	}

	/* ── Subscribe ── */
	.subscribe-wrap {
		display: flex;
		justify-content: flex-end;
		padding-top: 20px;
		margin-top: 12px;
		border-top: 1px solid #E5E7EB;
	}

	.subscribe-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 20px;
		background: #fff;
		border: 1px solid #4F46E5;
		border-radius: 3px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #4F46E5;
		text-decoration: none;
		cursor: pointer;
		transition: background 0.15s;
	}
	.subscribe-btn:hover { background: #EEF2FF; }

	.caret { font-size: 11px; }

	@media (max-width: 600px) {
		.day-mini-cal { max-width: 100%; }
		.ev-bottombar { flex-direction: column; gap: 10px; align-items: center; }
	}
</style>
