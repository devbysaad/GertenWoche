export interface DirectoryEntry {
	id: string;
	slug: string;
	name: string;
	logo: string;
	description: string;
	address: string;
	city?: string;
	country?: string;
	phone?: string;
	email?: string;
	website?: string;
	category: string;
}
