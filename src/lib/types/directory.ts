/**
 * @file directory.ts
 * TypeScript interface for a Branchenverzeichnis (business directory) entry.
 * Data comes from the static DIRECTORY_ENTRIES array in src/lib/data/directory.ts
 * and from the WordPress custom post type via the API.
 */

export interface DirectoryEntry {
	id: string;
	slug: string;
	name: string;
	/** URL to the company logo image */
	logo: string;
	/** Long-form company description (may contain \n\n paragraph breaks) */
	description: string;
	address: string;
	zip?: string;
	city?: string;
	country?: string;
	/** Array because some companies have multiple phone numbers */
	phone?: string[];
	email?: string;
	website?: string;
	/** Business category label (e.g. "Gartenbau", "Pflanzenschutz") */
	category: string;
}

