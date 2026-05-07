import { format, isToday, isThisWeek } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Format a date as German long format: "19. Mai 2026"
 */
export function formatGermanDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'd. MMMM yyyy', { locale: de });
}

/**
 * Format a date as German short format: "19. Mai 2026"
 */
export function formatGermanShort(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'd. MMM yyyy', { locale: de });
}

/**
 * Get German day of week: "Donnerstag"
 */
export function getDayOfWeek(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'EEEE', { locale: de });
}

/**
 * Full German date with day name: "Donnerstag, 07. Mai 2026"
 */
export function formatGermanFull(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, "EEEE, dd. MMMM yyyy", { locale: de });
}

/**
 * Short month name in German: "Mai"
 */
export function getGermanMonth(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'MMMM', { locale: de });
}

/**
 * Short month abbreviation: "Mai", "Jun"
 */
export function getGermanMonthShort(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return format(d, 'MMM', { locale: de });
}

/**
 * Format a date range: "19. – 23. Mai 2026"
 */
export function formatGermanDateRange(start: Date | string, end: Date | string): string {
	const s = typeof start === 'string' ? new Date(start) : start;
	const e = typeof end === 'string' ? new Date(end) : end;

	const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
	const sameDay = s.toDateString() === e.toDateString();

	if (sameDay) return formatGermanDate(s);
	if (sameMonth) {
		return `${format(s, 'd.', { locale: de })} – ${format(e, 'd. MMMM yyyy', { locale: de })}`;
	}
	return `${formatGermanDate(s)} – ${formatGermanDate(e)}`;
}

export { isToday, isThisWeek };
