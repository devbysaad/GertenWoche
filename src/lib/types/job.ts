export interface JobListing {
	id: string;
	title: string;
	company: string;
	location: string;
	type: string;           // e.g. "Vollzeit 100%", "Teilzeit 80%"
	description: string;    // raw HTML
	excerpt: string;        // plain text
	postedAt: Date;
	expiresAt: Date | null;
	applyUrl: string;
	logo: string;
	slug: string;
	url: string;
}
