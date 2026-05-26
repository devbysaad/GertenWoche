<script lang="ts">
	import type { DirectoryEntry } from '$lib/types/index.js';

	interface Props {
		entries: DirectoryEntry[];
	}
	let { entries }: Props = $props();
</script>

<section class="dir-widget" aria-label="Branchenverzeichnis">
	<h2 class="dir-heading">Branchenverzeichnis</h2>
	<hr class="dir-rule" />

	<ul class="dir-list">
		{#each entries as entry}
			<li class="dir-item">
				<a href="/branchenverzeichnis/eintrag/{entry.slug}" class="dir-link">
					<div class="dir-logo">
						{#if entry.logo && entry.logo.trim() !== ''}
							<img
								src={entry.logo}
								alt={entry.name}
								loading="lazy"
								width="50"
								height="40"
							/>
						{:else}
							<div class="dir-logo-ph"></div>
						{/if}
					</div>
					<span class="dir-name">{entry.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.dir-widget {
		padding: 0;
		margin: 0;
	}

	/* Heading: dark, medium weight, green underline */
	.dir-heading {
		font-family: 'Open Sans', sans-serif;
		font-size: 17px;
		font-weight: 600;
		color: #222;
		margin: 0 0 4px;
		padding-bottom: 4px;
		border-bottom: 3px solid #5a9e3a; /* green like real site */
		display: inline-block;
	}

	/* Horizontal rule below heading */
	.dir-rule {
		border: none;
		border-top: 1px solid #E0E0E0;
		margin: 0 0 10px;
	}

	/* List */
	.dir-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* Row */
	.dir-item { margin: 0; padding: 0; }

	.dir-link {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
	}
	.dir-link:hover .dir-name {
		color: #5a9e3a;
	}

	/* Logo: ~50×40, left-aligned, no background box */
	.dir-logo {
		width: 50px;
		height: 40px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dir-logo img {
		max-width: 50px;
		max-height: 40px;
		width: auto;
		height: auto;
		object-fit: contain;
		display: block;
	}
	.dir-logo-ph {
		width: 50px;
		height: 40px;
		background: #EBEBEB;
	}

	/* Name: dark, reads like a link */
	.dir-name {
		font-family: 'Open Sans', sans-serif;
		font-size: 15px;
		font-weight: 400;
		color: #222;
		line-height: 1.3;
		transition: color 0.15s;
	}
</style>
