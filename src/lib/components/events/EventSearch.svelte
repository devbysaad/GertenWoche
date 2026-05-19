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
</script>

<form class="ev-search" onsubmit={handleSubmit} role="search" aria-label="Veranstaltungen suchen">
	<div class="ev-search-inner">
		<svg class="ev-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
			<circle cx="11" cy="11" r="8"/>
			<line x1="21" y1="21" x2="16.65" y2="16.65"/>
		</svg>
		<input
			type="search"
			bind:value
			placeholder="Search for events"
			class="ev-search-input"
			aria-label="Suchbegriff"
			id="event-search"
		/>
	</div>
	<button type="submit" class="ev-search-btn">Search events</button>
</form>

<style>
	.ev-search {
		display: flex;
		align-items: stretch;
		margin-bottom: 16px;
		border: 1px solid #ccc;
		background: #fff;
		overflow: hidden;
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
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #333;
		border: none;
		outline: none;
		background: transparent;
		appearance: none;
	}
	.ev-search-input::placeholder { color: #aaa; }
	.ev-search-input::-webkit-search-cancel-button { display: none; }

	.ev-search-btn {
		display: flex;
		align-items: center;
		padding: 10px 20px;
		background: #4F46E5;
		color: #fff;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		white-space: nowrap;
		flex-shrink: 0;
		transition: background 0.15s;
	}
	.ev-search-btn:hover { background: #4338CA; }

	@media (max-width: 500px) {
		.ev-search-btn { padding: 10px 14px; font-size: 12px; }
	}
</style>
