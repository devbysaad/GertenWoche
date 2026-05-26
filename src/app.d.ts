// This file declares types for environment variables used in the app.
// SvelteKit reads these via import.meta.env (Vite) and $env modules.

/// <reference types="@sveltejs/kit" />

import type { WPUser } from '$lib/types/user';

declare global {
	namespace App {
		interface Locals {
			user: WPUser | null;
		}
	}
}
export {};

// Private env vars (server-only, accessed via $env/static/private or process.env)
declare module '$env/static/private' {
	// Node environment
	const NODE_ENV: 'development' | 'production' | 'test';

	// Optional: Basic Auth credentials for admin area (future)
	const ADMIN_USERNAME: string | undefined;
	const ADMIN_PASSWORD: string | undefined;

	// Optional: Sentry DSN for error tracking
	const SENTRY_DSN: string | undefined;

	// Optional: Redis URL for distributed caching (future)
	const REDIS_URL: string | undefined;
}

// Public env vars (safe to expose to client, prefix VITE_ or PUBLIC_)
declare module '$env/static/public' {
	// The canonical site URL
	const PUBLIC_SITE_URL: string;

	// Google Analytics ID (optional)
	const PUBLIC_GA_ID: string | undefined;
}

// Dynamic env vars (runtime, accessed via $env/dynamic/private)
declare module '$env/dynamic/private' {
	interface PrivateEnv {
		NODE_ENV?: string;
		PORT?: string;
		// WordPress REST
		PUBLIC_WP_URL?: string;
		WP_API_BASE?: string;
		// HeadlessKey plugin (auth backend)
		WP_HEADLESSKEY_BASE?: string;
		// Legacy / unused (kept for backward compat with stale callers)
		WP_JWT_AUTH_URL?: string;
		WP_JWT_VALIDATE_URL?: string;
		// Session signing key (reserved)
		AUTH_SECRET?: string;
	}
	const env: PrivateEnv;
	export { env };
}
