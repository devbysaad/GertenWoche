/**
 * In-memory cache with TTL for server-side API responses.
 * Prevents hammering the WordPress REST API on every request.
 *
 * TTL tiers:
 *   - ARTICLES:   5 minutes  (content updates rarely)
 *   - CATEGORIES: 30 minutes (taxonomy changes very rarely)
 *   - EVENTS:     10 minutes (updated more often)
 *   - WEATHER:    15 minutes (API rate limit friendly)
 *   - SEARCH:     2 minutes  (freshness matters more)
 */

interface CacheEntry<T> {
	data: T;
	expiresAt: number;
	hits: number;
}

interface CacheStats {
	size: number;
	hits: number;
	misses: number;
	keys: string[];
}

// ─── TTL Constants (ms) ──────────────────────────────────────
export const TTL = {
	ARTICLES: 5 * 60_000,    // 5 min
	CATEGORIES: 30 * 60_000, // 30 min
	EVENTS: 10 * 60_000,     // 10 min
	WEATHER: 15 * 60_000,    // 15 min
	DIRECTORY: 60 * 60_000,  // 60 min
	SEARCH: 2 * 60_000,      // 2 min
	DEFAULT: 5 * 60_000      // 5 min fallback
} as const;

// ─── Internal store ──────────────────────────────────────────
const store = new Map<string, CacheEntry<unknown>>();
let totalHits = 0;
let totalMisses = 0;

// ─── Public API ──────────────────────────────────────────────

/**
 * Retrieve a cached value by key.
 * Returns null if not found or expired.
 */
export function getCached<T>(key: string): T | null {
	const entry = store.get(key) as CacheEntry<T> | undefined;
	if (!entry) {
		totalMisses++;
		return null;
	}
	if (Date.now() > entry.expiresAt) {
		store.delete(key);
		totalMisses++;
		return null;
	}
	entry.hits++;
	totalHits++;
	return entry.data;
}

/**
 * Store a value in the cache.
 * @param key   - Cache key (typically the request URL)
 * @param data  - Data to cache
 * @param ttl   - Time-to-live in milliseconds (default: TTL.DEFAULT)
 */
export function setCached<T>(key: string, data: T, ttl = TTL.DEFAULT): void {
	store.set(key, {
		data,
		expiresAt: Date.now() + ttl,
		hits: 0
	});
}

/**
 * Delete a specific cache entry.
 */
export function invalidate(key: string): void {
	store.delete(key);
}

/**
 * Invalidate all keys matching a prefix pattern.
 */
export function invalidatePattern(prefix: string): void {
	for (const key of store.keys()) {
		if (key.startsWith(prefix)) store.delete(key);
	}
}

/**
 * Clear the entire cache.
 */
export function clearCache(): void {
	store.clear();
	totalHits = 0;
	totalMisses = 0;
}

/**
 * Get cache diagnostics (for /api/cache-stats endpoint in dev).
 */
export function getCacheStats(): CacheStats {
	const now = Date.now();
	// Purge expired entries first
	for (const [key, entry] of store.entries()) {
		if (now > entry.expiresAt) store.delete(key);
	}
	return {
		size: store.size,
		hits: totalHits,
		misses: totalMisses,
		keys: [...store.keys()]
	};
}

// ─── Auto-purge expired entries every 10 minutes ─────────────
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of store.entries()) {
			if (now > entry.expiresAt) store.delete(key);
		}
	},
	10 * 60_000
);
