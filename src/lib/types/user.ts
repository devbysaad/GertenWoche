/**
 * Authenticated user as seen by the server (locals.user) and the layout data.
 *
 * The shape comes from HeadlessKey's /token + /token/validate responses,
 * normalized + enriched. Fields are mostly optional so consumers can be
 * defensive — different HeadlessKey endpoints return slightly different
 * subsets of the user object.
 */
export interface WPUser {
	id: number;
	username: string;
	name: string;
	displayName: string;
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
	roles: string[];
	isPro: boolean;
	/** Raw HeadlessKey JWT. Never sent to the client (cookie is HttpOnly). */
	token: string;
	/** Unix-seconds expiry decoded from the JWT payload, or 0 if unknown. */
	expiresAt: number;
}

export type User = WPUser;
