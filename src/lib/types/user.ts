export interface WPUser {
	id: number;
	username: string;
	name: string;
	email: string;
	avatar: string;
	roles: string[];
	isPro: boolean;
	token: string;
}

export type User = WPUser;
