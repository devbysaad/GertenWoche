import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { loadUserData } from '$lib/server/userStore';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/anmelden-registrieren');

	const record = loadUserData(locals.user.id);

	// Profile defaults come from the saved store; fall back to whatever
	// HeadlessKey gave us at login time, so a brand-new user immediately
	// sees their HeadlessKey-issued name/email instead of empty fields.
	const u = locals.user;
	const profile = {
		firstName:   record.profile.firstName   ?? u.firstName   ?? '',
		lastName:    record.profile.lastName    ?? u.lastName    ?? '',
		displayName: record.profile.displayName ?? u.displayName ?? u.username ?? '',
		email:       record.profile.email       ?? u.email       ?? '',
		bio:         record.profile.bio         ?? ''
	};

	const billing = {
		firstName: record.billing.firstName ?? '',
		lastName:  record.billing.lastName  ?? '',
		company:   record.billing.company   ?? '',
		vat:       record.billing.vat       ?? '',
		address:   record.billing.address   ?? '',
		country:   record.billing.country   ?? '',
		city:      record.billing.city      ?? '',
		district:  record.billing.district  ?? '',
		postal:    record.billing.postal    ?? '',
		phone:     record.billing.phone     ?? '',
		email:     record.billing.email     ?? u.email ?? ''
	};

	return {
		user: u,
		profile,
		billing,
		updatedAt: record.updatedAt
	};
};
