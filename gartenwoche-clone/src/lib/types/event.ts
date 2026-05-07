export interface GartenEvent {
	id: string;
	slug: string;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	location: string;
	city: string;
	country: string;
	thumbnail: string;
	organizer?: string;
	websiteUrl?: string;
	website?: string;
}
