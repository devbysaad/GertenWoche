<script lang="ts">
	import type { GartenEvent } from '$lib/types/index.js';

	interface Props {
		events: GartenEvent[];
		year: number;
		month: number; // 0-indexed
		onNavigate: (year: number, month: number) => void;
	}
	let { events = [], year, month, onNavigate }: Props = $props();

	const DAYS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
	const MONTHS_DE = [
		'Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'
	];

	// Build calendar grid (42 cells, Mon-Sun)
	const cells = $derived(() => {
		const firstDay = new Date(year, month, 1);
		// getDay(): 0=Sun,1=Mon...6=Sat → convert to Mon-first: Mon=0
		const startDow = (firstDay.getDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrev = new Date(year, month, 0).getDate();

		const cells: Array<{ day: number; currentMonth: boolean; events: GartenEvent[]; isToday: boolean }> = [];
		const today = new Date();

		// Leading days from previous month
		for (let i = startDow - 1; i >= 0; i--) {
			cells.push({ day: daysInPrev - i, currentMonth: false, events: [], isToday: false });
		}

		// Current month days
		for (let d = 1; d <= daysInMonth; d++) {
			const isToday =
				today.getFullYear() === year &&
				today.getMonth() === month &&
				today.getDate() === d;
			const dayEvents = events.filter((e) => {
				const start = e.startDate;
				const end = e.endDate;
				const cell = new Date(year, month, d);
				return cell >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
					cell <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
			});
			cells.push({ day: d, currentMonth: true, events: dayEvents, isToday });
		}

		// Trailing days
		const remaining = 42 - cells.length;
		for (let d = 1; d <= remaining; d++) {
			cells.push({ day: d, currentMonth: false, events: [], isToday: false });
		}

		return cells;
	});

	function prevMonth() {
		if (month === 0) onNavigate(year - 1, 11);
		else onNavigate(year, month - 1);
	}

	function nextMonth() {
		if (month === 11) onNavigate(year + 1, 0);
		else onNavigate(year, month + 1);
	}
</script>

<div class="month-view">
	<!-- Month header nav -->
	<div class="month-nav">
		<button onclick={prevMonth} aria-label="Vorheriger Monat">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>
		<h2 class="month-title">{MONTHS_DE[month]} {year}</h2>
		<button onclick={nextMonth} aria-label="Nächster Monat">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</button>
	</div>

	<!-- Day headers -->
	<div class="cal-grid">
		{#each DAYS_DE as day}
			<div class="cal-header">{day}</div>
		{/each}

		{#each cells() as cell}
			<div
				class="cal-cell"
				class:other-month={!cell.currentMonth}
				class:today={cell.isToday}
				class:has-event={cell.events.length > 0}
			>
				<span class="cell-day">{cell.day}</span>
				{#if cell.events.length > 0}
					<div class="cell-events">
						{#each cell.events.slice(0, 2) as event}
							<a href="/veranstaltung/{event.slug}" class="cell-event-dot" title={event.title}></a>
						{/each}
						{#if cell.events.length > 2}
							<span class="cell-more">+{cell.events.length - 2}</span>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.month-view {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.month-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--color-border);
		background: var(--color-primary);
		color: #fff;
	}

	.month-nav button {
		background: none;
		border: none;
		cursor: pointer;
		color: #fff;
		display: flex;
		align-items: center;
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		transition: background 0.2s ease;
	}

	.month-nav button:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.month-title {
		font-family: var(--font-heading);
		font-size: 18px;
		font-weight: 700;
		margin: 0;
	}

	.cal-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}

	.cal-header {
		font-family: var(--font-heading);
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		text-align: center;
		padding: 10px 0 8px;
		border-bottom: 1px solid var(--color-border);
	}

	.cal-cell {
		min-height: 80px;
		border-right: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		transition: background 0.15s ease;
	}

	.cal-cell:nth-child(7n) {
		border-right: none;
	}

	.cal-cell:hover {
		background: var(--color-bg);
	}

	.other-month {
		opacity: 0.35;
	}

	.today .cell-day {
		background: var(--color-accent);
		color: var(--color-primary);
		width: 26px;
		height: 26px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 900;
	}

	.cell-day {
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text);
		width: 26px;
		height: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cell-events {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		margin-top: 2px;
	}

	.cell-event-dot {
		display: block;
		width: 100%;
		height: 4px;
		background: var(--color-primary);
		border-radius: 2px;
		transition: background 0.2s;
	}

	.cell-event-dot:hover {
		background: var(--color-accent);
	}

	.cell-more {
		font-family: var(--font-heading);
		font-size: 10px;
		color: var(--color-text-faint);
	}

	@media (max-width: 599px) {
		.cal-cell {
			min-height: 52px;
			padding: 4px;
		}
	}
</style>
