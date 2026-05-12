import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getArticleBySlug, getRelatedArticles, getCategoryBySlug } from '$lib/api/index.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { slug } = params;

	const article = await getArticleBySlug(slug);
	if (!article) throw error(404, `Artikel "${slug}" nicht gefunden`);

	const [related, category] = await Promise.all([
		getRelatedArticles(article.category.slug, slug, 4),
		getCategoryBySlug(article.category.slug)
	]);

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

	return { article, related, category, user };
};
