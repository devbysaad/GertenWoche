/**
 * better-auth catch-all — disabled until a cloud database is configured.
 * Login/register are handled by /api/auth/login and /api/auth/register.
 * Returns 503 gracefully instead of crashing the function.
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = () =>
	json({ error: 'Auth provider not configured' }, { status: 503 });

export const POST: RequestHandler = () =>
	json({ error: 'Auth provider not configured' }, { status: 503 });
