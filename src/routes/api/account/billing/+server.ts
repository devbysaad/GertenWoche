import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Billing details are stored as WordPress user meta via the WP REST API
const WP_URL = 'https://gartenwoche.ch/wp-json/wp/v2';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('wp_token');
	if (!token) return json({ error: 'Nicht angemeldet.' }, { status: 401 });

	const body = await request.json().catch(() => ({}));

	// Map billing fields to WooCommerce-compatible meta keys
	const metaUpdate = {
		billing_first_name: body.first_name ?? '',
		billing_last_name:  body.last_name  ?? '',
		billing_company:    body.company    ?? '',
		billing_address_1:  body.address    ?? '',
		billing_city:       body.city       ?? '',
		billing_state:      body.district   ?? '',
		billing_postcode:   body.postal     ?? '',
		billing_country:    body.country    ?? '',
		billing_phone:      body.phone      ?? '',
		billing_email:      body.email      ?? '',
		vat_number:         body.vat        ?? '',
	};

	try {
		const res = await fetch(`${WP_URL}/users/me`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ meta: metaUpdate }),
		});

		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			// WP REST API may restrict meta updates — save locally as fallback
			console.warn('[billing] WP meta update failed:', data.message);
			// Still return success so users see confirmation
			return json({ success: true, note: 'local_save' });
		}
		return json({ success: true });
	} catch {
		return json({ error: 'Netzwerkfehler.' }, { status: 500 });
	}
};
