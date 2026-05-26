/**
 * Job Listings API — fetches from WP Job Manager plugin via jm-ajax endpoint.
 *
 * Endpoint: POST https://gartenwoche.ch/jm-ajax/get_listings/
 * Also tries WP REST API: GET /wp-json/wp/v2/job_listing
 *
 * Results are cached for 15 minutes.
 */

import { env } from '$env/dynamic/private';
import { getCached, setCached } from './cache.js';
import type { JobListing } from '$lib/types/index.js';

function getWpOrigin() {
	const wpUrl = env.PUBLIC_WP_URL ?? 'https://gartenwoche.ch/wp-json';
	return wpUrl.endsWith('/wp-json') ? wpUrl.slice(0, -8) : wpUrl;
}
function getJmAjaxUrl() {
	return `${getWpOrigin()}/jm-ajax/get_listings/`;
}
function getWpRestUrl() {
	return `${getWpOrigin()}/wp-json/wp/v2/job_listing`;
}
const CACHE_TTL   = 15 * 60_000; // 15 min
const TIMEOUT     = 20_000;

// ─────────────────────────────────────────────────────────────
// Raw types
// ─────────────────────────────────────────────────────────────

interface JmAjaxJob {
	ID: number;
	post_title: string;
	post_name: string;    // slug
	post_content: string; // HTML
	post_excerpt: string;
	permalink: string;
	posted_on: string;    // "X days ago" or ISO date
	_company_name: string;
	_company_logo: string;
	_job_location: string;
	_job_expires: string;
	_company_website: string;
	job_type?: { name?: string }[];
}

interface JmAjaxResponse {
	found_jobs: boolean;
	showing_all_jobs: boolean;
	html: string;         // pre-rendered HTML — we parse raw JSON instead
	jobs: JmAjaxJob[];
	max_num_pages: number;
	total_jobs: number;
}

interface WpJobPost {
	id: number;
	slug: string;
	link: string;
	date: string;
	title: { rendered: string };
	content: { rendered: string };
	excerpt: { rendered: string };
	meta?: {
		_company_name?: string;
		_company_logo?: string;
		_job_location?: string;
		_job_expires?: string;
		_job_type?: string;
		_company_website?: string;
	};
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
	return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}

async function safeFetch(url: string, opts?: RequestInit): Promise<Response | null> {
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
		const res = await fetch(url, { signal: ctrl.signal, ...opts });
		clearTimeout(timer);
		if (!res.ok) return null;
		return res;
	} catch {
		return null;
	}
}

function fromJmAjax(job: JmAjaxJob): JobListing {
	return {
		id:          String(job.ID),
		slug:        job.post_name,
		title:       job.post_title,
		company:     job._company_name ?? '',
		location:    job._job_location ?? '',
		type:        job.job_type?.[0]?.name ?? 'Vollzeit',
		description: job.post_content,
		excerpt:     stripHtml(job.post_excerpt || job.post_content).slice(0, 200),
		postedAt:    new Date(job.posted_on) ?? new Date(),
		expiresAt:   job._job_expires ? new Date(job._job_expires) : null,
		applyUrl:    job.permalink,
		logo:        job._company_logo ?? '',
		url:         job.permalink
	};
}

function fromWpRest(post: WpJobPost): JobListing {
	return {
		id:          String(post.id),
		slug:        post.slug,
		title:       stripHtml(post.title.rendered),
		company:     post.meta?._company_name ?? '',
		location:    post.meta?._job_location ?? '',
		type:        post.meta?._job_type ?? 'Vollzeit',
		description: post.content.rendered,
		excerpt:     stripHtml(post.excerpt.rendered).slice(0, 200),
		postedAt:    new Date(post.date),
		expiresAt:   post.meta?._job_expires ? new Date(post.meta._job_expires) : null,
		applyUrl:    post.link,
		logo:        post.meta?._company_logo ?? '',
		url:         post.link
	};
}

// ─────────────────────────────────────────────────────────────
// Fetch strategies
// ─────────────────────────────────────────────────────────────

async function fetchViaJmAjax(page = 1, perPage = 20): Promise<JobListing[] | null> {
	const body = new URLSearchParams({
		per_page:    String(perPage),
		page:        String(page),
		orderby:     'date',
		order:       'DESC',
		show_pagination: '0'
	});

	const res = await safeFetch(getJmAjaxUrl(), {
		method:  'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});
	if (!res) return null;

	try {
		const data: JmAjaxResponse = await res.json();
		if (!data?.found_jobs || !data.jobs?.length) return null;
		return data.jobs.map(fromJmAjax);
	} catch {
		return null;
	}
}

async function fetchViaWpRest(): Promise<JobListing[] | null> {
	const res = await safeFetch(`${getWpRestUrl()}?per_page=50&orderby=date&order=desc`);
	if (!res) return null;

	try {
		const posts: WpJobPost[] = await res.json();
		if (!posts?.length) return null;
		return posts.map(fromWpRest);
	} catch {
		return null;
	}
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

export interface JobFilter {
	keyword?: string;
	location?: string;
	type?: string;
	page?: number;
}

/**
 * Fetch job listings. Tries jm-ajax first (native WP Job Manager),
 * falls back to WP REST API post type, then returns empty array.
 */
export async function fetchJobListings(filter: JobFilter = {}): Promise<JobListing[]> {
	const cacheKey = `jobs:p${filter.page ?? 1}`;
	const cached = getCached<JobListing[]>(cacheKey);
	if (cached) return applyFilter(cached, filter);

	try {
		let jobs = await fetchViaJmAjax(filter.page ?? 1);

		if (!jobs || jobs.length === 0) {
			console.info('[jobs] jm-ajax returned no results — trying WP REST');
			jobs = await fetchViaWpRest();
		}

		if (!jobs || jobs.length === 0) {
			console.warn('[jobs] No job listings found from any source');
			return [];
		}

		setCached(cacheKey, jobs, CACHE_TTL);
		return applyFilter(jobs, filter);
	} catch (err) {
		console.error('[jobs] Unexpected error:', err);
		return [];
	}
}

function applyFilter(jobs: JobListing[], filter: JobFilter): JobListing[] {
	let result = jobs;
	if (filter.keyword) {
		const q = filter.keyword.toLowerCase();
		result = result.filter(
			j => j.title.toLowerCase().includes(q) ||
			     j.company.toLowerCase().includes(q) ||
			     j.description.toLowerCase().includes(q)
		);
	}
	if (filter.location) {
		const loc = filter.location.toLowerCase();
		result = result.filter(j => j.location.toLowerCase().includes(loc));
	}
	if (filter.type) {
		result = result.filter(j => j.type === filter.type);
	}
	return result;
}
