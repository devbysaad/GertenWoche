import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadUserData, saveProfile, type ProfileData } from '$lib/server/userStore';

/**
 * Account profile endpoint.
 *
 * The WordPress route `POST /wp/v2/users/me` is currently unreachable because
 * the legacy JWT-Auth plugin on gartenwoche.ch is misconfigured and rejects
 * every Bearer token with `jwt_auth_bad_config`. Until that's fixed on the WP
 * server, the source of truth for profile fields lives in the local JSON
 * store under `data/user-profiles.json`. See `src/lib/server/userStore.ts`.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}
	const { profile } = loadUserData(locals.user.id);

	// Sensible defaults if the user has never saved before: pre-fill from
	// the WP-side display name / email so the form isn't empty.
	const displayName = profile.display_name || locals.user.name || locals.user.username || '';
	const email       = profile.email        || locals.user.email || '';
	const [wpFirst = '', ...wpRest] = (locals.user.name ?? '').split(' ');
	const firstName   = profile.first_name   || wpFirst;
	const lastName    = profile.last_name    || wpRest.join(' ');

	return json({
		profile: {
			first_name:   firstName,
			last_name:    lastName,
			display_name: displayName,
			email
		} satisfies ProfileData
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Nicht angemeldet.' }, { status: 401 });
	}

	const body = (await request.json().catch(() => ({}))) as Partial<ProfileData>;

	// Validation — keep messages in German to match the rest of the UI.
	if (body.email !== undefined && body.email !== '' && !EMAIL_REGEX.test(body.email)) {
		return json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }, { status: 400 });
	}

	try {
		const saved = saveProfile(locals.user.id, {
			first_name:   body.first_name,
			last_name:    body.last_name,
			display_name: body.display_name,
			email:        body.email
		});
		return json({ success: true, profile: saved });
	} catch (err) {
		console.error('[profile] save failed:', err);
		return json({ error: 'Speichern fehlgeschlagen.' }, { status: 500 });
	}
};
