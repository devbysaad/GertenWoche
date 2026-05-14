export interface DirectoryEntry {
	id: string;
	slug: string;
	name: string;
	logo: string;
	description: string;
	address: string;
	zip?: string;
	city?: string;
	country?: string;
	phone?: string[];    // array — some entries have 2 numbers
	email?: string;
	website?: string;
	category: string;
}
