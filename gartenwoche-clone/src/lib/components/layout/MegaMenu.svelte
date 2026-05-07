<script lang="ts">
	interface NavChild {
		label: string;
		href: string;
	}

	interface Props {
		items: NavChild[];
		open: boolean;
	}

	let { items, open }: Props = $props();
</script>

{#if open}
	<div class="mega-menu" role="menu">
		{#each items as item}
			<a href={item.href} class="mega-item" role="menuitem">
				{item.label}
			</a>
		{/each}
	</div>
{/if}

<style>
	.mega-menu {
		position: absolute;
		top: 100%;
		left: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-top: 2px solid var(--color-accent);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		min-width: 200px;
		z-index: 200;
		animation: menuIn 0.18s ease;
		border-radius: 0 0 var(--radius-sm) var(--radius-sm);
		overflow: hidden;
	}

	@keyframes menuIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.mega-item {
		display: block;
		padding: 10px 16px;
		font-family: var(--font-heading);
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text);
		transition: all 0.15s ease;
		border-bottom: 1px solid var(--color-border);
	}

	.mega-item:last-child {
		border-bottom: none;
	}

	.mega-item:hover {
		background: var(--color-bg);
		color: var(--color-primary);
		padding-left: 20px;
	}
</style>
