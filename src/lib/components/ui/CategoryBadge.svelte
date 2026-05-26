<script lang="ts">
	import type { Category } from '$lib/types/index.js';

	interface Props {
		category: Category;
	}
	let { category }: Props = $props();
</script>

<a href="/category/{category.slug}" class="cat-badge" onclick={(e) => e.stopPropagation()}>
	{category.name}
</a>
