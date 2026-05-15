/**
 * Events API — fetches from The Events Calendar (Tribe Events) WordPress plugin.
 *
 * Two endpoints are tried in order:
 *   1. Tribe REST API v1:  /wp-json/tribe/events/v1/events   (richer data — venue, organizer)
 *   2. WP REST API v2:     /wp-json/wp/v2/tribe_events       (fallback, less data)
 *
 * Results are cached for TTL.EVENTS (10 min) via the shared cache module.
 */

import { getCached, setCached, TTL } from './cache.js';
import { FALLBACK_EVENTS } from './fallback.js';
import type { GartenEvent } from '$lib/types/index.js';

const WP_BASE   = 'https://gartenwoche.ch/wp-json';
const TRIBE_V1  = `${WP_BASE}/tribe/events/v1/events`;
const TRIBE_WP  = `${WP_BASE}/wp/v2/tribe_events`;
const TIMEOUT   = 20_000;

// ─────────────────────────────────────────────────────────────
// Raw Tribe REST v1 types
// ─────────────────────────────────────────────────────────────

interface TribeV1Venue {
	venue?: string;
	city?: string;
	country?: string;
	address?: string;
	zip?: string;
}

interface TribeV1Organizer {
	organizer?: string;
	website?: string;
	email?: string;
}

interface TribeV1Event {
	id: number;
	slug: string;
	title: string;       // plain text
	description: string; // HTML
	excerpt?: string;
	start_date: string;  // "2025-06-01 09:00:00"
	end_date: string;
	image?: { url?: string; sizes?: { medium?: { url?: string } } };
	venue?: TribeV1Venue;
	organizer?: TribeV1Organizer[];
	url: string;
}

interface TribeV1Response {
	events: TribeV1Event[];
	total: number;
	total_pages: number;
}

// Raw WP v2 tribe_events post type
interface WpTribePost {
	id: number;
	slug: string;
	link: string;
	title: { rendered: string };
	content: { rendered: string };
	meta?: {
		_EventStartDate?: string;
		_EventEndDate?: string;
		_EventVenueName?: string;
		_EventCity?: string;
		_EventCountry?: string;
		_EventOrganizerName?: string;
		_EventURL?: string;
	};
	_embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string }> };
}

// ─────────────────────────────────────────────────────────────
// HTTP helper with timeout
// ─────────────────────────────────────────────────────────────

async function safeFetch(url: string): Promise<Response | null> {
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: { Accept: 'application/json' }
		});
		clearTimeout(timer);
		if (!res.ok) return null;
		return res;
	} catch {
		return null;
	}
}

// ─────────────────────────────────────────────────────────────
// Transform helpers
// ─────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim();
}

function parseDate(raw: string | undefined | null): Date {
	if (!raw) return new Date();
	// Tribe format: "2025-06-01 09:00:00" — needs T for JS Date
	const normalised = raw.includes('T') ? raw : raw.replace(' ', 'T');
	const d = new Date(normalised);
	return isNaN(d.getTime()) ? new Date() : d;
}

function fromTribeV1(e: TribeV1Event): GartenEvent {
	const venue    = e.venue;
	const organizer = e.organizer?.[0];
	return {
		id:          String(e.id),
		slug:        e.slug,
		title:       stripHtml(e.title),
		description: e.description,
		startDate:   parseDate(e.start_date),
		endDate:     parseDate(e.end_date),
		location:    venue?.venue ?? '',
		address:     [venue?.address, venue?.zip, venue?.city].filter(Boolean).join(', ') || undefined,
		city:        venue?.city ?? '',
		country:     venue?.country ?? 'Schweiz',
		thumbnail:   e.image?.sizes?.medium?.url ?? e.image?.url ?? '',
		organizer:   organizer?.organizer,
		websiteUrl:  organizer?.website ?? e.url,
		website:     e.url
	};
}

function fromWpV2(e: WpTribePost): GartenEvent {
	return {
		id:          String(e.id),
		slug:        e.slug,
		title:       stripHtml(e.title.rendered),
		description: e.content.rendered,
		startDate:   parseDate(e.meta?._EventStartDate),
		endDate:     parseDate(e.meta?._EventEndDate),
		location:    e.meta?._EventVenueName ?? '',
		city:        e.meta?._EventCity ?? '',
		country:     e.meta?._EventCountry ?? 'Schweiz',
		thumbnail:   e._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
		organizer:   e.meta?._EventOrganizerName,
		websiteUrl:  e.meta?._EventURL ?? e.link,
		website:     e.link
	};
}

// ─────────────────────────────────────────────────────────────
// Tribe v1 paginated fetch
// ─────────────────────────────────────────────────────────────

export interface EventFilter {
	startDate?: string;   // "2025-01-01"
	endDate?: string;     // "2026-12-31"
	perPage?: number;
	page?: number;
	past?: boolean;
}

async function fetchAllTribeV1(filter: EventFilter = {}): Promise<GartenEvent[] | null> {
	const params = new URLSearchParams({
		per_page: String(filter.perPage ?? 50),
		page:     String(filter.page ?? 1)
	});
	if (filter.startDate) params.set('start_date', filter.startDate);
	if (filter.endDate)   params.set('end_date',   filter.endDate);

	const url = `${TRIBE_V1}?${params}`;
	const cacheKey = `tribe_v1:${url}`;
	const cached = getCached<GartenEvent[]>(cacheKey);
	if (cached) return cached;

	const res = await safeFetch(url);
	if (!res) return null;

	const body: TribeV1Response = await res.json();
	if (!body?.events?.length) return null;

	const events = body.events.map(fromTribeV1);
	const totalPages = body.total_pages ?? 1;

	// Fetch remaining pages concurrently if needed
	if (totalPages > 1) {
		const pages = await Promise.all(
			Array.from({ length: totalPages - 1 }, (_, i) => {
				const p = new URLSearchParams(params);
				p.set('page', String(i + 2));
				return safeFetch(`${TRIBE_V1}?${p}`).then(r => r?.json() as Promise<TribeV1Response>);
			})
		);
		for (const pg of pages) {
			if (pg?.events?.length) events.push(...pg.events.map(fromTribeV1));
		}
	}

	setCached(cacheKey, events, TTL.EVENTS);
	return events;
}

// ─────────────────────────────────────────────────────────────
// WP v2 fallback
// ─────────────────────────────────────────────────────────────

async function fetchWpV2Events(): Promise<GartenEvent[] | null> {
	const cacheKey = 'tribe_wp_v2:all';
	const cached = getCached<GartenEvent[]>(cacheKey);
	if (cached) return cached;

	const res = await safeFetch(`${TRIBE_WP}?_embed&per_page=50`);
	if (!res) return null;

	const posts: WpTribePost[] = await res.json();
	if (!posts?.length) return null;

	const events = posts.map(fromWpV2);
	setCached(cacheKey, events, TTL.EVENTS);
	return events;
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Fetch events. Tries Tribe REST v1, falls back to WP v2, then static fallback.
 */
export async function fetchEvents(filter: EventFilter = {}): Promise<GartenEvent[]> {
	try {
		// Try Tribe v1 first (richest data)
		const v1 = await fetchAllTribeV1(filter);
		if (v1 && v1.length > 0) return v1;

		// Fallback: WP REST v2 (less venue data)
		const v2 = await fetchWpV2Events();
		if (v2 && v2.length > 0) {
			// Apply date filtering manually since WP v2 has no date params
			const now = new Date();
			if (filter.past) {
				return v2.filter(e => e.endDate < now).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
			}
			return v2.filter(e => e.endDate >= now).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
		}

		// Static fallback
		console.warn('[events] Both Tribe APIs failed — using fallback data');
		return FALLBACK_EVENTS;
	} catch (err) {
		console.error('[events] Unexpected error:', err);
		return FALLBACK_EVENTS;
	}
}

/**
 * Fetch a single event by slug. Searches all events.
 */
export async function fetchEventBySlug(slug: string): Promise<GartenEvent | null> {
	const all = await fetchEvents();
	// Also check past events
	const allWithPast = await fetchEvents({ past: true });
	return [...all, ...allWithPast].find(e => e.slug === slug) ?? null;
}
