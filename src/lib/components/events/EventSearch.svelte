<script lang="ts">
	interface Props {
		value: string;
		onSearch: (q: string) => void;
		activeView: string;
		onViewChange: (v: string) => void;
	}
	let {
		value = $bindable(""),
		onSearch,
		activeView,
		onViewChange,
	}: Props = $props();

	function handleInput() {
		onSearch(value);
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSearch(value);
	}
</script>

<div class="ev-search-combo">
	<form
		class="ev-search-form"
		onsubmit={handleSubmit}
		role="search"
		aria-label="Veranstaltungen suchen"
	>
		<div class="ev-search-inner">
			<svg
				class="ev-search-icon"
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<input
				type="search"
				bind:value
				oninput={handleInput}
				placeholder="Veranstaltungen suchen…"
				class="ev-search-input"
				aria-label="Suchbegriff"
				id="event-search"
			/>
		</div>
		<button type="submit" class="ev-search-btn">Suchen</button>
	</form>

	<div class="view-switcher">
		{#each [["list", "Liste"], ["month", "Monat"], ["day", "Tag"]] as [v, label]}
			<button
				type="button"
				class="vsw-btn"
				class:active={activeView === v}
				onclick={() => onViewChange(v)}>{label}</button
			>
		{/each}
	</div>
</div>

<style>
	.ev-search-combo {
		display: flex;
		align-items: stretch;
		justify-content: space-around;
		margin-bottom: 16px;
		border: 1px solid #ccc;
		background: #fff;
		overflow: hidden;
		width: 100%;
	}

	.ev-search-form {
		flex: 2;
		display: flex;
		align-items: stretch;
	}

	.ev-search-inner {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 0 12px;
		gap: 8px;
	}

	.ev-search-icon {
		color: #888;
		flex-shrink: 0;
	}

	.ev-search-input {
		flex: 1;
		padding: 10px 0;
		font-family: "Open Sans", sans-serif;
		font-size: 14px;
		color: #333;
		border: none;
		outline: none;
		background: transparent;
		appearance: none;
	}
	.ev-search-input::placeholder {
		color: #aaa;
	}
	.ev-search-input::-webkit-search-cancel-button {
		display: none;
	}

	.ev-search-btn {
		display: flex;
		align-items: center;
		padding: 0 20px;
		background: #4f46e5;
		color: #fff;
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background 0.15s;
	}
	.ev-search-btn:hover {
		background: #4338ca;
	}

	/* ── View switcher inside the bar ── */
	.view-switcher {
		display: flex;
		align-items: stretch;
		border-left: 1px solid #ccc;
		flex: 1;
	}
	.vsw-btn {
		flex: 1;
		padding: 0 18px;
		font-family: "Open Sans", sans-serif;
		font-size: 13px;
		color: #555;
		background: #fff;
		border: none;
		border-left: 1px solid #e5e7eb;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
		white-space: nowrap;
	}
	.vsw-btn:first-child {
		border-left: none;
	}
	.vsw-btn:hover {
		background: #f3f4f6;
		color: #111;
	}
	.vsw-btn.active {
		background: transparent;
		color: #111;
		border-bottom: 2px solid #111;
		font-weight: 600;
	}

	@media (max-width: 700px) {
		.ev-search-combo {
			flex-direction: column;
			height: auto;
		}
		.view-switcher {
			border-top: 1px solid #ccc;
			border-left: none;
		}
		.vsw-btn {
			flex: 1;
			padding: 10px 0;
		}
	}
</style>
