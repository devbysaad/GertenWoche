<script lang="ts">
	import EventListView from '$lib/components/events/EventListView.svelte';
	import EventMonthView from '$lib/components/events/EventMonthView.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let calYear = $state(new Date().getFullYear());
	let calMonth = $state(new Date().getMonth());
	let showPast = $state(false);
	let filterDropOpen = $state(false);

	function handleNavigate(y: number, m: number) {
		calYear = y;
		calMonth = m;
	}

	function goToday() { showPast = false; }
	function goPrev()  { showPast = true; }
	function goNext()  { showPast = false; }
</script>

<svelte:head>
	<title>Veranstaltungen | Gartenwoche</title>
	<meta name="description" content="Alle Gartenmessen, Ausstellungen und Veranstaltungen in der Schweiz und Europa – Gartenwoche Veranstaltungskalender." />
	<link rel="canonical" href="https://gartenwoche.ch/veranstaltungen" />
</svelte:head>

<div class="events-page">
	<div class="container">

		<!-- Top nav bar: arrows + Today + Future dropdown -->
		<div class="ev-topbar">
			<button class="nav-arrow" onclick={goPrev} aria-label="Vorherige" type="button">‹</button>
			<button class="nav-arrow" onclick={goNext} aria-label="Nächste" type="button">›</button>
			<button class="today-btn" onclick={goToday} type="button">Heute</button>
			<div class="filter-wrap">
				<button class="filter-btn" onclick={() => filterDropOpen = !filterDropOpen} type="button">
					{showPast ? 'Vergangene' : 'Zukünftige'} <span class="caret">∨</span>
				</button>
				{#if filterDropOpen}
					<div class="filter-drop">
						<button onclick={() => { showPast = false; filterDropOpen = false; }} type="button">Zukünftige</button>
						<button onclick={() => { showPast = true; filterDropOpen = false; }} type="button">Vergangene</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Month separator -->
		<div class="month-separator">
			<span class="month-label">Mai 2026</span>
			<hr class="month-line" />
		</div>

		<!-- Event list -->
		<EventListView events={showPast ? data.past : data.upcoming} showPast={showPast} />

		<!-- Bottom nav -->
		<div class="ev-bottombar">
			<button class="prev-link" onclick={goPrev} type="button">‹ Vorherige Ereignisse</button>
			<button class="next-link" onclick={goNext} type="button">Nächste Ereignisse ›</button>
		</div>

		<!-- Subscribe to calendar -->
		<div class="subscribe-wrap">
			<button class="subscribe-btn" type="button">
				Kalender abonnieren <span class="caret">∨</span>
			</button>
		</div>

	</div>
</div>

<style>
	.events-page {
		padding: 24px 0 48px;
		background: #fff;
	}

	/* Top nav bar */
	.ev-topbar {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
	}

	.nav-arrow {
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid #CCC;
		border-radius: 2px;
		font-size: 20px;
		color: #333;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0 0 2px;
		transition: border-color 0.15s;
	}
	.nav-arrow:hover { border-color: #888; }

	.today-btn {
		padding: 6px 14px;
		background: none;
		border: 1px solid #CCC;
		border-radius: 2px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #333;
		cursor: pointer;
		transition: border-color 0.15s;
	}
	.today-btn:hover { border-color: #888; }

	.filter-wrap {
		position: relative;
		margin-left: 10px;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0;
		background: none;
		border: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #222;
		cursor: pointer;
	}

	.caret { font-size: 13px; color: #666; }

	.filter-drop {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		background: #fff;
		border: 1px solid #E0E0E0;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		z-index: 50;
		min-width: 160px;
	}
	.filter-drop button {
		display: block;
		width: 100%;
		text-align: left;
		padding: 10px 16px;
		background: none;
		border: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		cursor: pointer;
	}
	.filter-drop button:hover { background: #F7F7F7; }

	/* Month label + horizontal rule */
	.month-separator {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px 0;
	}
	.month-label {
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #888;
		white-space: nowrap;
	}
	.month-line {
		flex: 1;
		border: none;
		border-top: 1px solid #E0E0E0;
		margin: 0;
	}

	/* Bottom nav */
	.ev-bottombar {
		display: flex;
		justify-content: space-between;
		padding: 20px 0;
		border-top: 1px solid #E0E0E0;
		margin-top: 4px;
	}
	.prev-link, .next-link {
		background: none;
		border: none;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #888;
		cursor: pointer;
		padding: 0;
	}
	.prev-link:hover, .next-link:hover { color: #333; }

	/* Subscribe */
	.subscribe-wrap {
		display: flex;
		justify-content: flex-end;
		padding-top: 12px;
	}
	.subscribe-btn {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 20px;
		background: #fff;
		border: 1px solid #2D1B69;
		border-radius: 2px;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #2D1B69;
		cursor: pointer;
		transition: background 0.15s;
	}
	.subscribe-btn:hover { background: #F5F5FF; }
</style>
