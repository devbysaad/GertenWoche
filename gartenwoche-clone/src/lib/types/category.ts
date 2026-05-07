export interface Category {
	id: string;
	name: string;
	slug: string;
	parent?: string; // parent category slug
	count: number;
}
