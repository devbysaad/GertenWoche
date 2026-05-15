<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		year: number;
		month: number;   // 0-indexed
		view: string;
		onNavigate: (year: number, month: number) => void;
	}
	let { year, month, view, onNavigate }: Props = $props();

	const MONTHS_DE = [
		'Januar','Februar','März','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'
	];

	const today = new Date();

	function prevMonth() {
		let y = year, m = month - 1;
		if (m < 0) { m = 11; y--; }
		onNavigate(y, m);
	}

	function nextMonth() {
		let y = year, m = month + 1;
		if (m > 11) { m = 0; y++; }
		onNavigate(y, m);
	}

	function goToday() {
		onNavigate(today.getFullYear(), today.getMonth());
	}

	// Format date range label: "1 Mai 2026 - Heute"
	const rangeLabel = $derived(() => {
		const start = `1 ${MONTHS_DE[month]} ${year}`;
		const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
		return isCurrentMonth ? `${start} – Heute` : `${MONTHS_DE[month]} ${year}`;
	});

	const isCurrentMonth = $derived(
		today.getFullYear() === year && today.getMonth() === month
	);
</script>

<div class="month-nav-bar">
	<!-- Left: arrows + Today -->
	<div class="nav-controls">
		<button class="arrow-btn" onclick={prevMonth} aria-label="Vorheriger Monat" type="button">‹</button>
		<button class="arrow-btn" onclick={nextMonth} aria-label="Nächster Monat" type="button">›</button>
		<button
			class="today-btn"
			class:active={isCurrentMonth}
			onclick={goToday}
			type="button"
		>Heute</button>
	</div>

	<!-- Center: Month/Year label -->
	<div class="month-title-area">
		<span class="month-display">{MONTHS_DE[month]} {year}</span>
	</div>

	<!-- Right: view tabs -->
	<div class="view-tabs">
		{#each [['list', 'Liste'], ['month', 'Monat'], ['day', 'Tag']] as [v, label]}
			<a
				href="?view={v}&month={year}-{String(month + 1).padStart(2, '0')}"
				class="view-tab"
				class:active={view === v}
				aria-current={view === v ? 'page' : undefined}
			>{label}</a>
		{/each}
	</div>
</div>

<style>
	.month-nav-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
		flex-wrap: wrap;
	}

	/* ── Arrow controls ── */
	.nav-controls {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}

	.arrow-btn {
		width: 30px;
		height: 30px;
		background: none;
		border: 1px solid #D1D5DB;
		border-radius: 3px;
		font-size: 18px;
		color: #555;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0 0 1px;
		transition: border-color 0.15s, color 0.15s;
	}
	.arrow-btn:hover { border-color: #6B7280; color: #111; }

	.today-btn {
		padding: 5px 12px;
		background: none;
		border: 1px solid #D1D5DB;
		border-radius: 3px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s;
	}
	.today-btn:hover { border-color: #6B7280; color: #111; }
	.today-btn.active { border-color: #4F46E5; color: #4F46E5; }

	/* ── Month title ── */
	.month-title-area {
		flex: 1;
	}
	.month-display {
		font-family: 'Open Sans', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #111;
	}

	/* ── View tabs ── */
	.view-tabs {
		display: flex;
		border: 1px solid #D1D5DB;
		border-radius: 3px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.view-tab {
		padding: 5px 14px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #555;
		text-decoration: none;
		border-right: 1px solid #D1D5DB;
		background: #fff;
		transition: background 0.15s, color 0.15s;
	}
	.view-tab:last-child { border-right: none; }
	.view-tab:hover { background: #F3F4F6; color: #111; }
	.view-tab.active { background: #4F46E5; color: #fff; border-color: #4F46E5; }
	.view-tab.active + .view-tab { border-left-color: #4F46E5; }

	@media (max-width: 600px) {
		.month-title-area { order: -1; width: 100%; }
		.month-nav-bar { gap: 8px; }
	}
</style>
