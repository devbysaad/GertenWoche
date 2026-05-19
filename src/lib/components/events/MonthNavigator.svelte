<script lang="ts">
	interface Props {
		year: number;
		month: number; // 0-indexed
		view: string;
		onNavigate: (year: number, month: number) => void;
	}
	let { year, month, view, onNavigate }: Props = $props();

	const MONTHS_DE = [
		"Januar",
		"Februar",
		"März",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Dezember",
	];

	const today = new Date();

	function prevMonth() {
		let y = year,
			m = month - 1;
		if (m < 0) {
			m = 11;
			y--;
		}
		onNavigate(y, m);
	}

	function nextMonth() {
		let y = year,
			m = month + 1;
		if (m > 11) {
			m = 0;
			y++;
		}
		onNavigate(y, m);
	}

	function goToday() {
		onNavigate(today.getFullYear(), today.getMonth());
	}

	const isCurrentMonth = $derived(
		today.getFullYear() === year && today.getMonth() === month,
	);
</script>

<div class="month-nav-bar">
	<!-- Left: arrows + Today -->
	<div class="nav-controls">
		<button
			class="arrow-btn"
			onclick={prevMonth}
			aria-label="Vorheriger Monat"
			type="button">‹</button
		>
		<button
			class="arrow-btn"
			onclick={nextMonth}
			aria-label="Nächster Monat"
			type="button">›</button
		>
		<button
			class="today-btn"
			class:active={isCurrentMonth}
			onclick={goToday}
			type="button">Heute</button
		>
	</div>

	<!-- Center: Month/Year label -->
	<div class="month-title-area">
		<span class="month-display">{MONTHS_DE[month]} {year}</span>
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
		border: 1px solid #d1d5db;
		border-radius: 3px;
		font-size: 18px;
		color: #555;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0 0 1px;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.arrow-btn:hover {
		border-color: #6b7280;
		color: #111;
	}

	.today-btn {
		padding: 5px 12px;
		background: none;
		border: 1px solid #d1d5db;
		border-radius: 3px;
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #555;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.today-btn:hover {
		border-color: #6b7280;
		color: #111;
	}
	.today-btn.active {
		border-color: #4f46e5;
		color: #4f46e5;
	}

	/* ── Month title ── */
	.month-title-area {
		flex: 1;
	}
	.month-display {
		font-family: "Open Sans", sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #111;
	}

	@media (max-width: 600px) {
		.month-title-area {
			order: -1;
			width: 100%;
		}
		.month-nav-bar {
			gap: 8px;
		}
	}
</style>
