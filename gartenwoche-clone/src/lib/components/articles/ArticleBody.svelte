<script lang="ts">
	interface Props {
		content: string;
	}
	let { content }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="prose article-body">{@html content}</div>

<style>
	.article-body :global(p) {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 16px;
		line-height: 1.85;
		color: var(--color-text);
		margin-bottom: 1.3em;
	}

	.article-body :global(h2) {
		font-family: var(--font-heading);
		font-size: 24px;
		font-weight: 700;
		margin-top: 2em;
		margin-bottom: 0.75em;
		color: var(--color-text);
		border-bottom: 2px solid var(--color-accent);
		padding-bottom: 6px;
	}

	.article-body :global(h3) {
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 700;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		color: var(--color-text);
	}

	.article-body :global(h4) {
		font-family: var(--font-heading);
		font-size: 17px;
		font-weight: 700;
		margin-top: 1.2em;
		margin-bottom: 0.4em;
	}

	.article-body :global(img) {
		width: 100%;
		border-radius: var(--radius-sm);
		margin: 1.5em 0;
	}

	.article-body :global(figure) {
		margin: 1.5em 0;
	}

	.article-body :global(figcaption) {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
		text-align: center;
		margin-top: 6px;
		font-style: italic;
	}

	.article-body :global(blockquote) {
		border-left: 4px solid var(--color-accent);
		padding: 12px 20px;
		margin: 1.5em 0;
		background: var(--color-bg);
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
		font-style: italic;
		color: var(--color-text-muted);
	}

	.article-body :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.article-body :global(a:hover) {
		opacity: 0.75;
	}

	.article-body :global(ul),
	.article-body :global(ol) {
		font-family: var(--font-body);
		font-size: 16px;
		padding-left: 1.5em;
		margin-bottom: 1.2em;
		line-height: 1.8;
	}

	.article-body :global(li) {
		margin-bottom: 0.4em;
	}

	.article-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5em 0;
		font-size: 14px;
	}

	.article-body :global(th) {
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-weight: 700;
		padding: 10px 12px;
		text-align: left;
	}

	.article-body :global(td) {
		padding: 9px 12px;
		border-bottom: 1px solid var(--color-border);
	}

	.article-body :global(tr:nth-child(even) td) {
		background: var(--color-bg);
	}

	.article-body :global(strong) {
		font-weight: 700;
		color: var(--color-text);
	}

	.article-body :global(em) {
		font-style: italic;
	}

	.article-body :global(hr) {
		border: none;
		border-top: 2px solid var(--color-border);
		margin: 2em 0;
	}
</style>
