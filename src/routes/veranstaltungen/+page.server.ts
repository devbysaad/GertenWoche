import type { PageServerLoad } from './$types.js';
import { fetchEvents } from '$lib/api/events.js';

export const load: PageServerLoad = async ({ url }) => {
	const view   = url.searchParams.get('view')   ?? 'list';
	const month  = url.searchParams.get('month')  ?? null;  // "2026-05"
	const search = url.searchParams.get('search') ?? '';

	const now = new Date();

	// Determine which month to display
	let displayDate: Date;
	if (month) {
		const [y, m] = month.split('-').map(Number);
		displayDate = new Date(y, m - 1, 1);
	} else {
		displayDate = new Date(now.getFullYear(), now.getMonth(), 1);
	}

	const y = displayDate.getFullYear();
	const m = displayDate.getMonth(); // 0-indexed

	// Date range for the displayed month (first day .. last day)
	const firstOfMonth = `${y}-${String(m + 1).padStart(2, '0')}-01`;
	const lastDay = new Date(y, m + 1, 0).getDate();
	const lastOfMonth = `${y}-${String(m + 1).padStart(2, '0')}-${lastDay}`;

	// For list view: load current month + 2 months forward (upcoming range)
	// For month/day view: just that month
	const isPastMonth = displayDate < new Date(now.getFullYear(), now.getMonth(), 1);
	const isFutureMonth = displayDate > new Date(now.getFullYear(), now.getMonth(), 1);

	// Extend range for list view (show 3 months of upcoming events)
	const rangeEnd = view === 'list' && !isPastMonth
		? `${y + (m + 3 > 11 ? 1 : 0)}-${String(((m + 3) % 12) + 1).padStart(2, '0')}-01`
		: lastOfMonth;

	const [monthEvents, upcomingEvents] = await Promise.all([
		// Events for the selected month (calendar/day view)
		fetchEvents({ startDate: firstOfMonth, endDate: lastOfMonth }),
		// Upcoming events from today (list view default)
		!month ? fetchEvents({ startDate: now.toISOString().slice(0, 10) }) : Promise.resolve([])
	]);

	let events = !month && view === 'list' ? upcomingEvents : monthEvents;

	// Fallback: when the default list view has zero upcoming events,
	// surface the most recent past events instead so the page is never
	// empty just because the calendar has nothing scheduled ahead.
	let fallbackToPast = false;
	if (!month && view === 'list' && events.length === 0) {
		const past = await fetchEvents({ past: true });
		if (past.length > 0) {
			events = past.slice(0, 12);
			fallbackToPast = true;
		}
	}

	return {
		events,
		view,
		month: month ?? `${y}-${String(m + 1).padStart(2, '0')}`,
		displayYear: y,
		displayMonth: m,
		search,
		// Treat the fallback view as "past" so EventListView styles cards
		// accordingly and the user gets the right visual cue.
		isPastMonth: isPastMonth || fallbackToPast,
		fallbackToPast,
		totalCount: events.length
	};
};
