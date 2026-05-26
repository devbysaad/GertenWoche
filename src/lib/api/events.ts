/**
 * Events API — fetches from The Events Calendar (Tribe Events) WordPress plugin.
 *
 * Endpoint: /wp-json/tribe/events/v1/events  (public, no auth)
 *
 * The standard WP REST endpoint /wp/v2/tribe_events was tried previously as a
 * fallback but is structurally broken — Tribe does not expose its custom post
 * type through that route, so it always returns `[]` even when events exist.
 * It has been removed so a real v1 outage surfaces as an empty result with a
 * clear warning instead of being silently masked.
 *
 * Results are cached for TTL.EVENTS (10 min) via the shared cache module.
 */

import { env } from '$env/dynamic/private';
import { getCached, setCached, TTL } from './cache.js';
import type { GartenEvent } from '$lib/types/index.js';

function getWpBase() {
	return env.PUBLIC_WP_URL ?? 'https://gartenwoche.ch/wp-json';
}
function getTribeV1() {
	return `${getWpBase()}/tribe/events/v1/events`;
}
const TIMEOUT = 20_000;

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

// Tribe REST v1 defaults `start_date` to "today", so calling it without a
// window silently hides every past event on the server. Always pass an
// explicit wide window and filter past/future locally inside fetchEvents().
const TRIBE_WIDE_START = '2000-01-01 00:00:00';
const TRIBE_WIDE_END   = '2099-12-31 23:59:59';

async function fetchAllTribeV1(filter: EventFilter = {}): Promise<GartenEvent[] | null> {
	const params = new URLSearchParams({
		per_page: String(filter.perPage ?? 50),
		page:     String(filter.page ?? 1),
		start_date: filter.startDate ?? TRIBE_WIDE_START,
		end_date:   filter.endDate   ?? TRIBE_WIDE_END
	});

	const url = `${getTribeV1()}?${params}`;
	const cacheKey = `tribe_v1:${url}`;
	const cached = getCached<GartenEvent[]>(cacheKey);
	if (cached) return cached;

	const res = await safeFetch(url);
	// `null` here means "request failed / non-2xx" — keep the caller's
	// fallback path. An empty `events` array is a valid 200 OK response and
	// must NOT be treated as failure (otherwise we cascade to v2 and end
	// up logging a misleading "Both APIs failed" when the calendar simply
	// has nothing in the requested window).
	if (!res) return null;

	const body: TribeV1Response = await res.json();
	const events = (body?.events ?? []).map(fromTribeV1);
	const totalPages = body?.total_pages ?? 1;

	if (totalPages > 1) {
		const pages = await Promise.all(
			Array.from({ length: totalPages - 1 }, (_, i) => {
				const p = new URLSearchParams(params);
				p.set('page', String(i + 2));
				return safeFetch(`${getTribeV1()}?${p}`).then((r) => r?.json() as Promise<TribeV1Response>);
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
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Sort + past/future filter shared by both upstream paths.
 *
 * When `filter.past` is true we return events that have already ended,
 * newest first. Otherwise we return events that haven't ended yet,
 * soonest first.
 */
function applyTimeFilter(events: GartenEvent[], filter: EventFilter): GartenEvent[] {
	const now = new Date();
	if (filter.past) {
		return events
			.filter((e) => e.endDate < now)
			.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
	}
	return events
		.filter((e) => e.endDate >= now)
		.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/**
 * Fetch events from the upstream WordPress calendar via Tribe REST v1.
 *
 * - The 2000–2099 window is always sent so the upstream's default
 *   "from today" filter doesn't hide past events. Past/future
 *   selection happens locally in `applyTimeFilter`.
 * - `[]` is a valid successful result (calendar empty in the
 *   requested window) and is cached for TTL.EVENTS.
 * - `null` from `fetchAllTribeV1` only happens on real request
 *   failure (non-2xx / timeout / network) — surfaced as a single
 *   warn and an empty array.
 */
export async function fetchEvents(filter: EventFilter = {}): Promise<GartenEvent[]> {
	try {
		const v1 = await fetchAllTribeV1(filter);
		if (v1 !== null) return applyTimeFilter(v1, filter);

		console.warn('[events] Tribe v1 unreachable — returning [].');
		return [];
	} catch (err) {
		console.error('[events] Unexpected error:', err);
		return [];
	}
}

/**
 * Display-friendly variant: return upcoming events when available, otherwise
 * fall back to the most recent past events so widgets like the home page
 * "Veranstaltungen" block are never empty just because the upstream calendar
 * has nothing scheduled ahead.
 *
 * Returns an object so callers can render an "events have already taken
 * place" hint when `isPast` is true.
 */
export async function fetchUpcomingOrRecent(limit = 4): Promise<{
	events: GartenEvent[];
	isPast: boolean;
}> {
	const upcoming = await fetchEvents();
	if (upcoming.length > 0) {
		return { events: upcoming.slice(0, limit), isPast: false };
	}
	const past = await fetchEvents({ past: true });
	return { events: past.slice(0, limit), isPast: past.length > 0 };
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
