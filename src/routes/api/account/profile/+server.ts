import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const WP_URL = 'https://gartenwoche.ch/wp-json/wp/v2';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('wp_token');
	if (!token) return json({ error: 'Nicht angemeldet.' }, { status: 401 });

	const body = await request.json().catch(() => ({}));

	// Build WP user update payload (only send non-empty fields)
	const update: Record<string, string> = {};
	if (body.first_name)   update.first_name   = body.first_name;
	if (body.last_name)    update.last_name     = body.last_name;
	if (body.display_name) update.name          = body.display_name;
	if (body.email)        update.email         = body.email;
	if (body.password)     update.password      = body.password;

	try {
		const res = await fetch(`${WP_URL}/users/me`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(update),
		});

		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			return json({ error: data.message ?? 'Aktualisierung fehlgeschlagen.' }, { status: res.status });
		}
		return json({ success: true, user: data });
	} catch {
		return json({ error: 'Netzwerkfehler beim Aktualisieren.' }, { status: 500 });
	}
};
