const WP_URL = 'https://gartenwoche.ch/wp-json';
const JWT_ENDPOINT = `${WP_URL}/jwt-auth/v1/token`;
const VALIDATE_ENDPOINT = `${WP_URL}/jwt-auth/v1/token/validate`;
const ME_ENDPOINT = `${WP_URL}/wp/v2/users/me`;

const PRO_ROLES = ['contributor', 'author', 'editor', 'administrator', 'subscriber_pro'];

function mapProfileToUser(profile: any, token: string) {
	return {
		id: profile.id,
		username: profile.slug,
		name: profile.name,
		email: profile.email,
		avatar: profile.avatar_urls?.['96'] ?? '',
		roles: profile.roles ?? [],
		isPro: (profile.roles ?? []).some((r: string) => PRO_ROLES.includes(r)),
		token
	};
}

export async function loginWithWordPress(username: string, password: string) {
	const res = await fetch(JWT_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message || 'Login fehlgeschlagen');
	}

	const data = await res.json();
	const token = data.token;

	const profileRes = await fetch(ME_ENDPOINT, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!profileRes.ok) {
		throw new Error('Benutzerprofil konnte nicht geladen werden');
	}

	const profile = await profileRes.json();
	return mapProfileToUser(profile, token);
}

export async function validateToken(token: string) {
	try {
		const res = await fetch(VALIDATE_ENDPOINT, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!res.ok) return null;

		const profileRes = await fetch(ME_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!profileRes.ok) return null;

		const profile = await profileRes.json();
		return mapProfileToUser(profile, token);
	} catch {
		return null;
	}
}
