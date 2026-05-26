import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ user: null });
	}
	const { token, ...safeUser } = locals.user;
	return json({ user: safeUser });
};
