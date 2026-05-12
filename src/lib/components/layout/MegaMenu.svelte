<script lang="ts">
	import { slide } from 'svelte/transition';

	interface NavChild { label: string; href: string; }
	interface NavItem { label: string; href: string; children?: NavChild[]; }

	interface Props {
		items: NavItem[];
		open: boolean;
	}
	let { items, open }: Props = $props();
</script>

{#if open}
	<div class="mega-menu" transition:slide={{ duration: 200 }}>
		<div class="mega-inner">
			{#each items as item}
				<div class="mega-col">
					<a href={item.href} class="mega-parent">{item.label}</a>
					{#if item.children}
						<ul class="mega-children">
							{#each item.children as child}
								<li><a href={child.href}>{child.label}</a></li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.mega-menu {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: #fff;
		border-top: 3px solid var(--color-accent);
		border-bottom: 1px solid var(--color-border);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		z-index: 150;
		padding: 24px 0;
	}

	.mega-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 32px;
	}

	.mega-parent {
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-primary);
		text-decoration: none;
		display: block;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 2px solid var(--color-accent);
	}

	.mega-children {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.mega-children a {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.mega-children a:hover {
		color: var(--color-primary);
	}

	@media (max-width: 1023px) {
		.mega-inner {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 599px) {
		.mega-inner {
			grid-template-columns: 1fr;
		}
	}
</style>
