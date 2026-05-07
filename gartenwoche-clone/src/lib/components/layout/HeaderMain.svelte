<script lang="ts">
	import Logo from './Logo.svelte';
	import SocialIcons from './SocialIcons.svelte';
	import { formatGermanFull } from '$lib/utils/date.js';

	interface Props {
		weather: { temp: number | null; city: string };
	}
	let { weather }: Props = $props();

	const today = formatGermanFull(new Date());
	const tempDisplay = $derived(
		weather.temp !== null ? `${weather.temp}°C ${weather.city}` : `—°C ${weather.city}`
	);
</script>

<header class="header-main">
	<div class="container header-inner">
		<!-- Left: Logo -->
		<div class="header-logo">
			<Logo />
		</div>

		<!-- Center: Date + Weather -->
		<div class="header-center">
			<span class="header-date">{today}</span>
			<div class="header-weather">
				<svg class="weather-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
				</svg>
				<span>{tempDisplay}</span>
			</div>
		</div>

		<!-- Right: Social + Account -->
		<div class="header-right">
			<SocialIcons size={18} />
			<a href="/mein-konto" class="account-btn">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
				<span>Mein Konto</span>
			</a>
		</div>
	</div>
</header>

<style>
	.header-main {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding-top: 14px;
		padding-bottom: 14px;
		min-height: 80px;
	}

	.header-logo {
		flex-shrink: 0;
	}

	.header-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	.header-date {
		font-family: var(--font-heading);
		font-size: 12px;
		color: var(--color-text-muted);
		text-align: center;
	}

	.header-weather {
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.weather-icon {
		color: var(--color-primary);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	.account-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-text);
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		padding: 6px 12px;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.account-btn:hover {
		background: var(--color-primary);
		color: #fff;
		border-color: var(--color-primary);
	}

	/* Mobile adjustments */
	@media (max-width: 767px) {
		.header-center {
			display: none;
		}

		.header-inner {
			justify-content: space-between;
			min-height: 64px;
		}
	}

	@media (max-width: 479px) {
		.account-btn span {
			display: none;
		}
	}
</style>
