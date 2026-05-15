<script lang="ts">
	interface Props {
		value: string;
		onSearch: (q: string) => void;
	}
	let { value = $bindable(''), onSearch }: Props = $props();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onSearch(value);
	}

	function handleInput() {
		// Real-time filtering
		onSearch(value);
	}
</script>

<form class="ev-search" onsubmit={handleSubmit} role="search" aria-label="Veranstaltungen suchen">
	<input
		type="search"
		bind:value
		oninput={handleInput}
		placeholder="Nach Veranstaltungen suchen"
		class="ev-search-input"
		aria-label="Suchbegriff"
		id="event-search"
	/>
	<button type="submit" class="ev-search-btn" aria-label="Suchen">
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<circle cx="11" cy="11" r="8"/>
			<line x1="21" y1="21" x2="16.65" y2="16.65"/>
		</svg>
		Veranstaltungen suchen
	</button>
</form>

<style>
	.ev-search {
		display: flex;
		gap: 0;
		margin-bottom: 20px;
		border: 1px solid #D1D5DB;
		border-radius: 4px;
		overflow: hidden;
	}

	.ev-search-input {
		flex: 1;
		padding: 10px 14px;
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		border: none;
		outline: none;
		background: #fff;
		appearance: none;
	}

	.ev-search-input::placeholder { color: #9CA3AF; }

	/* remove default search clear button */
	.ev-search-input::-webkit-search-cancel-button { display: none; }

	.ev-search-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		background: #4F46E5;
		color: #fff;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.ev-search-btn:hover { background: #4338CA; }
</style>
