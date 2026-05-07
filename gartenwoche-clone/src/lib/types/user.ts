export interface User {
	id: string;
	username: string;
	email: string;
	tier: 'free' | 'pro';
	createdAt: Date;
}
