import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadUserData, saveBilling, type BillingData } from '$lib/server/userStore';

/**
 * Account billing / invoice endpoint.
 *
 * Same story as profile: WP's `/wp/v2/users/me` is blocked by the
 * misconfigured JWT plugin on gartenwoche.ch, so billing data is stored
 * server-side in `data/user-profiles.json`. See `src/lib/server/userStore.ts`.
 *
 * The previous version of this file silently returned `{ success: true }`
 * even on WP failures, which is what made "saved!" toasts appear while the
 * data was thrown away. That fake-success path is gone.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}
	const { billing } = loadUserData(locals.user.id);

	// Fall back to the logged-in email so the billing form has a starting point.
	const billingWithDefaults: BillingData = {
		...billing,
		email: billing.email || locals.user.email || ''
	};

	return json({ billing: billingWithDefaults });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}

	const body = (await request.json().catch(() => ({}))) as Partial<BillingData>;

	if (body.email !== undefined && body.email !== '' && !EMAIL_REGEX.test(body.email)) {
		return json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 });
	}

	try {
		const saved = saveBilling(locals.user.id, {
			first_name: body.first_name,
			last_name:  body.last_name,
			company:    body.company,
			vat:        body.vat,
			address:    body.address,
			country:    body.country,
			city:       body.city,
			district:   body.district,
			postal:     body.postal,
			phone:      body.phone,
			email:      body.email
		});
		return json({ success: true, billing: saved });
	} catch (err) {
		console.error('[billing] save failed:', err);
		return json({ error: 'Speichern fehlgeschlagen.' }, { status: 500 });
	}
};
