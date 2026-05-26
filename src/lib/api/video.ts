/**
 * Video & podcast helpers.
 *
 * - `PODCAST_EPISODES` is the canonical list of the seven hand-curated MP3s
 *   used by the "Podcast Garten" page. The `url` field points at the original
 *   gartenwoche.ch upload. Pages should normally render through the
 *   `/proxy?url=...` route so range requests and CORS work in the browser.
 *
 * - `getVideoOfWeek()` returns the embed URL + caption for the "Video der
 *   Woche" section on the homepage. We first try to discover a recent post
 *   tagged `video`/category `video-der-woche` on WP, then fall back to a
 *   hard-coded YouTube embed so the home page never goes blank.
 */

import type { WPPost } from '$lib/types/wp.js';

// ────────────────────────────────────────────────────────────────────────────
// Podcast episodes (hard-coded MP3s — the WP media library doesn't tag them)
// ────────────────────────────────────────────────────────────────────────────

export interface PodcastEpisode {
	id: number;
	title: string;
	/** Original upload URL on gartenwoche.ch */
	url: string;
}

export const PODCAST_EPISODES: PodcastEpisode[] = [
	{
		id: 1,
		title: 'Dickmaulrüssler',
		url: 'https://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3'
	},
	{
		id: 2,
		title: 'Die Sitkafichtenlaus',
		url: 'https://gartenwoche.ch/wp-content/uploads/2018/01/Die-Sitkafichtenlaus.mp3'
	},
	{
		id: 3,
		title: 'Braune Thuja',
		url: 'https://gartenwoche.ch/wp-content/uploads/2018/01/podcast-braune-thuja.mp3'
	},
	{
		id: 4,
		title: 'Rosenschädlinge Teil 1',
		url: 'https://gartenwoche.ch/wp-content/uploads/2018/01/Rosenschaedlinge-Teil-1.mp3'
	},
	{
		id: 5,
		title: 'Rosenschädlinge Teil 2',
		url: 'http://gartenwoche.ch/wp-content/uploads/2018/01/Rosenschaedlinge-Teil-2.mp3'
	},
	{
		id: 6,
		title: 'Der Birnengitterrost',
		url: 'http://gartenwoche.ch/wp-content/uploads/2018/01/Der-Birnengitterrost.mp3'
	},
	{
		id: 7,
		title: 'Ratgeber 11.05.2018',
		url: 'https://gartenwoche.ch/wp-content/uploads/2018/05/Ratgeber_11-05-2018-1108.1526034486838.mp3'
	}
];

/** Wrap a raw MP3 URL with the SvelteKit /proxy endpoint for range + CORS. */
export function proxiedAudioUrl(rawUrl: string): string {
	return `/proxy?url=${encodeURIComponent(rawUrl)}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Video der Woche
// ────────────────────────────────────────────────────────────────────────────

const WP_BASE = 'https://gartenwoche.ch/wp-json/wp/v2';
const FALLBACK_VIDEO_ID = 'dQw4w9WgXcQ'; // safe placeholder, override via WP
const VIDEO_FETCH_TIMEOUT_MS = 8000;

export interface VideoOfWeek {
	embedUrl: string;
	description: string;
}

/**
 * Try to extract a YouTube/Vimeo embed URL from a WP post body.
 * Returns `null` if no recognisable embed is present.
 */
function extractEmbedFromHtml(html: string): string | null {
	const youtubeId = html.match(
		/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/
	);
	if (youtubeId) return `https://www.youtube.com/embed/${youtubeId[1]}`;

	const vimeoId = html.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/)(\d+)/);
	if (vimeoId) return `https://player.vimeo.com/video/${vimeoId[1]}`;

	return null;
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]*>/g, '')
		.replace(/&[^;]+;/g, ' ')
		.trim();
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response | null> {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
		clearTimeout(timer);
		return res;
	} catch {
		clearTimeout(timer);
		return null;
	}
}

/**
 * Look up the most recent post that looks like a "Video der Woche" entry and
 * return an embed URL. Falls back to a hard-coded YouTube id when WP returns
 * nothing usable, so the homepage section never renders empty.
 */
export async function getVideoOfWeek(): Promise<VideoOfWeek | null> {
	try {
		// Try a few likely category/tag slugs in order of preference.
		const candidateEndpoints = [
			`${WP_BASE}/posts?_embed&per_page=1&search=video%20der%20woche`,
			`${WP_BASE}/posts?_embed&per_page=1&categories_slug=video-der-woche`,
			`${WP_BASE}/posts?_embed&per_page=1&tags_slug=video`
		];

		for (const endpoint of candidateEndpoints) {
			const res = await fetchWithTimeout(endpoint, VIDEO_FETCH_TIMEOUT_MS);
			if (!res || !res.ok) continue;
			const posts = (await res.json()) as WPPost[];
			if (!posts?.length) continue;

			const post = posts[0];
			const embedUrl = extractEmbedFromHtml(post.content?.rendered ?? '');
			if (!embedUrl) continue;

			const description = stripHtml(post.excerpt?.rendered ?? post.title?.rendered ?? '');
			return { embedUrl, description: description.slice(0, 200) };
		}
	} catch (err) {
		console.warn('[video] getVideoOfWeek failed, using fallback:', err);
	}

	return {
		embedUrl: `https://www.youtube.com/embed/${FALLBACK_VIDEO_ID}`,
		description: 'Video der Woche'
	};
}
