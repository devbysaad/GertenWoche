<script lang="ts">
	import ArticleCard from '$lib/components/articles/ArticleCard.svelte';

	let { data } = $props();
	const { author, articles } = $derived(data);
</script>

<svelte:head>
	<title>{author.name} | Gartenwoche</title>
	<meta name="description" content="Alle Artikel von {author.name} auf Gartenwoche – dem unabhängigen Schweizer Gartenmagazin." />
</svelte:head>

<div class="author-page">
	<div class="container">
		<header class="author-header">
			{#if author.avatar}
				<img src={author.avatar} alt={author.name} class="author-avatar" width="80" height="80" />
			{:else}
				<div class="author-avatar-placeholder">
					{author.name[0]}
				</div>
			{/if}
			<div class="author-info">
				<h1 class="author-name">{author.name}</h1>
				{#if author.bio}
					<p class="author-bio">{author.bio}</p>
				{/if}
				<span class="author-count">{articles.length} Artikel</span>
			</div>
		</header>

		{#if articles.length > 0}
			<section class="author-articles">
				<h2 class="section-heading">Artikel von {author.name}</h2>
				<div class="articles-grid">
					{#each articles as article}
						<ArticleCard {article} />
					{/each}
				</div>
			</section>
		{:else}
			<p class="empty">Noch keine Artikel vorhanden.</p>
		{/if}
	</div>
</div>

<style>
	.author-page {
		padding: 32px 0 48px;
	}

	.author-header {
		display: flex;
		align-items: flex-start;
		gap: 20px;
		padding: 24px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		margin-bottom: 32px;
	}

	.author-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		flex-shrink: 0;
		border: 3px solid var(--color-accent);
	}

	.author-avatar-placeholder {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 32px;
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 3px solid var(--color-accent);
	}

	.author-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.author-name {
		font-family: var(--font-heading);
		font-size: 26px;
		font-weight: 900;
		color: var(--color-text);
		margin: 0;
	}

	.author-bio {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-text-muted);
		line-height: 1.6;
		max-width: 600px;
		margin: 0;
	}

	.author-count {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-text-faint);
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-top: 16px;
	}

	.empty {
		text-align: center;
		color: var(--color-text-muted);
		font-family: var(--font-body);
		padding: 40px;
	}

	@media (max-width: 1023px) {
		.articles-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 599px) {
		.articles-grid { grid-template-columns: 1fr; }
		.author-header { flex-direction: column; align-items: center; text-align: center; }
	}
</style>
