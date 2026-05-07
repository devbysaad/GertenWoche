/**
 * Fallback static data used when the WordPress REST API is unreachable.
 * Based on confirmed content from project-detail-claude.md.
 */

import type { Article, Author, Category, DirectoryEntry, GartenEvent } from '$lib/types/index.js';

export const FALLBACK_AUTHORS: Author[] = [
	{ id: '1', name: 'News-Redaktion', slug: 'redaktion-aktuelles', bio: 'Die Redaktion für aktuelle Gartennachrichten' },
	{ id: '2', name: 'Redaktion Wissen', slug: 'redaktion-wissen', bio: 'Fachwissen rund um den Garten' },
	{ id: '3', name: 'Redaktion Gartenpraxis', slug: 'redaktion-gartenpraxis', bio: 'Praxistipps für Gartenfreunde' },
	{ id: '4', name: 'Peter Sturm', slug: 'stemalo', bio: 'Chefredakteur und Gründer von Gartenwoche' }
];

export const FALLBACK_CATEGORIES: Category[] = [
	{ id: '1', name: 'Gartenpraxis', slug: 'gartenpraxis', count: 10 },
	{ id: '2', name: 'Pflanzen', slug: 'pflanzen', count: 25 },
	{ id: '3', name: 'Stauden', slug: 'stauden', parent: 'pflanzen', count: 8 },
	{ id: '4', name: 'Sommerflor', slug: 'sommerflor', parent: 'pflanzen', count: 5 },
	{ id: '5', name: 'Rosen', slug: 'rosen', parent: 'pflanzen', count: 6 },
	{ id: '6', name: 'Pflanzenempfehlungen', slug: 'pflanzenempfehlungen', parent: 'pflanzen', count: 12 },
	{ id: '7', name: 'Wasserpflanzen', slug: 'wasserpflanzen', parent: 'pflanzen', count: 4 },
	{ id: '8', name: 'Pflanzenschutz', slug: 'pflanzenschutz', count: 9 },
	{ id: '9', name: 'Rasen', slug: 'rasen', count: 7 },
	{ id: '10', name: 'Wissen', slug: 'wissen', count: 11 },
	{ id: '11', name: 'Aktuelles', slug: 'aktuelles', count: 20 },
	{ id: '12', name: 'Schweiz', slug: 'schweiz', parent: 'aktuelles', count: 8 },
	{ id: '13', name: 'Europa', slug: 'europa', parent: 'aktuelles', count: 6 },
	{ id: '14', name: 'Welt', slug: 'welt', parent: 'aktuelles', count: 5 },
	{ id: '15', name: 'Gartentechnik', slug: 'gartentechnik', count: 7 },
	{ id: '16', name: 'Produktschau', slug: 'produktschau', count: 10 }
];

function makeArticle(
	id: string,
	slug: string,
	title: string,
	categorySlug: string,
	authorSlug: string,
	isPro = false,
	daysAgo = 0
): Article {
	const cat = FALLBACK_CATEGORIES.find((c) => c.slug === categorySlug) ?? FALLBACK_CATEGORIES[0];
	const author = FALLBACK_AUTHORS.find((a) => a.slug === authorSlug) ?? FALLBACK_AUTHORS[0];
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);

	// Build URL path: if subcategory, "parent/category/slug" else "category/slug"
	const urlPath = cat.parent ? `${cat.parent}/${cat.slug}/${slug}` : `${cat.slug}/${slug}`;

	return {
		id,
		slug,
		urlPath,
		title,
		excerpt: `${title} – Lesen Sie hier den vollständigen Artikel über dieses Gartenthema. Erfahren Sie mehr über Tipps und Tricks für Ihren Garten.`,
		content: `<p>Dieser Artikel über <strong>${title}</strong> bietet Ihnen wertvolle Informationen und praktische Tipps für Ihren Garten.</p><p>Das Gärtnern ist eine der schönsten Hobbys – es verbindet uns mit der Natur und bietet Raum für Kreativität und Entspannung. In diesem Artikel erfahren Sie alles Wissenswerte zu diesem Thema.</p><p>Entdecken Sie, wie Sie Ihren Garten noch schöner gestalten können und welche Pflanzen sich besonders gut für die Schweizer Klimaverhältnisse eignen.</p>`,
		category: cat,
		author,
		publishedAt: date,
		updatedAt: date,
		thumbnail: `https://picsum.photos/seed/${slug}/800/450`,
		isPro,
		tags: [cat.slug, 'garten', 'schweiz'],
		commentCount: Math.floor(Math.random() * 20)
	};
}


export const FALLBACK_ARTICLES: Article[] = [
	makeArticle('1', 'nuesslisalat-ganzjaehriger-vitaminchampion', 'Nüsslisalat – ganzjähriger Vitaminchampion', 'schweiz', 'redaktion-aktuelles', false, 2),
	makeArticle('2', 'kress-voyager-hohe-maehleistung-fuer-profis', 'Kress Voyager – hohe Mähleistung für Profis', 'produktschau', 'stemalo', false, 4),
	makeArticle('3', 'biohybride-pflanzen-unibz', 'Biohybride Pflanzen: Uni Bozen entwickelt Superpflanzen', 'wissen', 'redaktion-wissen', false, 6),
	makeArticle('4', 'zwitschern-laesst-sich-pflanzen', 'So pflanzen Sie für die Vogelwelt', 'gartenpraxis', 'redaktion-gartenpraxis', false, 8),
	makeArticle('5', 'neue-hortensie-runaway-bride', 'Neue Hortensie: Runaway Bride', 'pflanzenempfehlungen', 'redaktion-aktuelles', true, 10),
	makeArticle('6', 'der-steppensalbei-salvia-nemorosa', 'Der Steppensalbei (Salvia nemorosa) – die besten Sorten', 'stauden', 'stemalo', false, 12),
	makeArticle('7', 'alternative-zur-lorbeerkirsche', 'Alternative zur Lorbeerkirsche: Der glänzende Liguster', 'pflanzenempfehlungen', 'redaktion-gartenpraxis', false, 14),
	makeArticle('8', 'hirse-im-rasen', 'Hirse im Rasen – erkennen und bekämpfen', 'rasen', 'redaktion-gartenpraxis', false, 16),
	makeArticle('9', 'lebende-alternative-zum-sonnenschirm', 'Lebende Alternative zum Sonnenschirm', 'gartenpraxis', 'redaktion-gartenpraxis', false, 18),
	makeArticle('10', 'die-maulwurfsgrille-oder-werre', 'Die Maulwurfsgrille oder Werre', 'pflanzenschutz', 'redaktion-wissen', false, 20),
	makeArticle('11', 'hydro-mousse-spruehen-fertig-rasen', 'Hydro-Mousse: Sprühen, fertig, Rasen', 'produktschau', 'stemalo', true, 22),
	makeArticle('12', 'mit-gartenpalmen-den-spaetsommer-geniessen', 'Mit Gartenpalmen den Spätsommer geniessen', 'pflanzenempfehlungen', 'redaktion-aktuelles', false, 24),
	makeArticle('13', 'der-schwarze-diamant-apfel-tibet', 'Der schwarze Diamant – ein ungewöhnlicher Apfel aus Tibet', 'welt', 'redaktion-aktuelles', false, 26),
	makeArticle('14', 'was-blueht-da-am-wegesrand', 'Was blüht da am Wegesrand?', 'wissen', 'redaktion-wissen', false, 28),
	makeArticle('15', 'von-der-strasse-auf-den-teller-salat', 'Salat nimmt giftige Zusatzstoffe aus Reifenabrieb auf', 'europa', 'redaktion-aktuelles', true, 30),
	makeArticle('16', 'blumeninseln-im-gruenen-rasenmeer', 'Blumeninseln im grünen Rasenmeer', 'gartenpraxis', 'redaktion-gartenpraxis', false, 32),
	makeArticle('17', 'natuerlichkeit-und-handwerkskunst', 'Natürlichkeit und Handwerkskunst im Hier und Jetzt', 'schweiz', 'redaktion-aktuelles', false, 34),
	makeArticle('18', 'seerosen-in-kleinen-gefaessen', 'Seerosen in kleinen Gefässen', 'wasserpflanzen', 'redaktion-gartenpraxis', false, 36),
	makeArticle('19', 'cornus-kuosa-scarlet-fire', "Cornus 'Scarlet Fire' – der Blumenhartriegel", 'pflanzenempfehlungen', 'stemalo', false, 38),
	makeArticle('20', 'zeitliche-veraenderungen-laubfall', 'Zeitliche Veränderungen im Laubfall haben Folgen für Flohkrebse', 'schweiz', 'redaktion-aktuelles', false, 40)
];

export const FALLBACK_EVENTS: GartenEvent[] = [
	{
		id: '1',
		slug: 'rhs-chelsea-flower-show',
		title: 'RHS Chelsea Flower Show',
		description: '<p>Die weltberühmte RHS Chelsea Flower Show ist das bedeutendste Gartenfestival der Welt. Erleben Sie atemberaubende Gartengestaltungen, die neuesten Pflanzentrendsund internationale Aussteller in London.</p>',
		startDate: new Date('2026-05-19'),
		endDate: new Date('2026-05-23'),
		location: 'Royal Hospital Chelsea',
		city: 'London',
		country: 'UK',
		thumbnail: 'https://picsum.photos/seed/chelsea-flower-show/800/450',
		websiteUrl: 'https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show'
	},
	{
		id: '2',
		slug: 'wyss-gartenakademie',
		title: 'Wyss Gartenakademie',
		description: '<p>Die Wyss Gartenakademie bietet praxisnahe Kurse und Workshops für Gartenbegeisterte. Lernen Sie von Experten und verbessern Sie Ihr Gartenwissen.</p>',
		startDate: new Date('2026-06-15'),
		endDate: new Date('2026-06-15'),
		location: 'Gartenhaus Zuchwil',
		city: 'Zuchwil',
		country: 'Schweiz',
		thumbnail: 'https://picsum.photos/seed/wyss-garten/800/450'
	}
];

export const FALLBACK_DIRECTORY: DirectoryEntry[] = [
	{ id: '1', slug: 'pflanzenschau-ag-2', name: 'Pflanzenschau AG', logo: '', description: 'Hochwertige Pflanzen und Gartenprodukte für den Schweizer Markt.', address: 'Hauptstrasse 1, 3000 Bern', phone: '+41 31 123 45 67', website: 'https://pflanzenschau.ch', category: 'Pflanzen' },
	{ id: '2', slug: 'erni-gartenbau-ag-2', name: 'Erni Gartenbau AG', logo: '', description: 'Professioneller Gartenbau und Landschaftsgestaltung in der Region Zentralschweiz.', address: 'Gartenweg 5, 6000 Luzern', phone: '+41 41 234 56 78', website: 'https://erni-gartenbau.ch', category: 'Gartenbau' },
	{ id: '3', slug: 'spross-ga-la-bau-ag-2', name: 'Spross Ga-La-Bau AG', logo: '', description: 'Garten- und Landschaftsbau mit über 20 Jahren Erfahrung.', address: 'Landschaftsstrasse 12, 8000 Zürich', phone: '+41 44 345 67 89', website: 'https://spross-galabau.ch', category: 'Gartenbau' },
	{ id: '4', slug: 'eibe-ag-2', name: 'eibe AG', logo: '', description: 'Innovative Gartenprodukte und nachhaltige Lösungen für Ihren Garten.', address: 'Innovationspark 3, 4000 Basel', phone: '+41 61 456 78 90', website: 'https://eibe.ch', category: 'Produkte' },
	{ id: '5', slug: 'trend-und-blumenboerse-luzern-2', name: 'Trend und Blumenbörse Luzern', logo: '', description: 'Die grösste Blumenbörse der Zentralschweiz – Blumen, Pflanzen und Dekorationen.', address: 'Blumenplatz 7, 6002 Luzern', phone: '+41 41 567 89 01', website: 'https://blumenboerse-luzern.ch', category: 'Pflanzen' },
	{ id: '6', slug: 'zebra-ag-garten-und-pool-2', name: 'Zebra AG Garten und Pool', logo: '', description: 'Ihr Spezialist für Gartengestaltung und Poolbau in der ganzen Schweiz.', address: 'Poolstrasse 15, 9000 St. Gallen', phone: '+41 71 678 90 12', website: 'https://zebra-garten-pool.ch', category: 'Gartenbau' },
	{ id: '7', slug: 'gartenbijoux-2', name: 'Gartenbijoux', logo: '', description: 'Exklusive Gartenaccessoires und dekorative Pflanzen für den gehobenen Anspruch.', address: 'Dekorationsweg 9, 1000 Lausanne', phone: '+41 21 789 01 23', website: 'https://gartenbijoux.ch', category: 'Accessoires' },
	{ id: '8', slug: 'il-vivaio-2', name: 'Il Vivaio', logo: '', description: 'Mediterrane Pflanzen und Gartenpflanzen aus eigenem Anbau im Tessin.', address: 'Via del Giardino 21, 6900 Lugano', phone: '+41 91 890 12 34', website: 'https://ilvivaio.ch', category: 'Pflanzen' }
];
