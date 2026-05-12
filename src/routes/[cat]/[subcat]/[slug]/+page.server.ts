import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticleByPath, getRelatedArticles, getCategories } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const path = `${params.cat}/${params.subcat}/${params.slug}`;
	const [article, categories] = await Promise.all([
		getArticleByPath(path),
		getCategories()
	]);

	if (!article) throw error(404, `Artikel nicht gefunden (${path})`);

	const related = await getRelatedArticles(
		article.subCategory?.slug ?? article.category.slug,
		article.slug,
		4
	);

	const user = locals.user
		? {
				id: locals.user.id,
				name: locals.user.name,
				username: locals.user.username,
				email: locals.user.email,
				avatar: locals.user.avatar,
				roles: locals.user.roles,
				isPro: locals.user.isPro
			}
		: null;

	return { article, related, categories, user };
};
