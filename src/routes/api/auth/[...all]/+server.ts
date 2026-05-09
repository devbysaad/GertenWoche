/**
 * better-auth API handler.
 * All auth requests (sign-in, sign-up, sign-out, session, etc.) go through here.
 * Route: /api/auth/[...all]
 */

import { auth } from '$lib/auth.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = ({ request }) => auth.handler(request);
export const POST: RequestHandler = ({ request }) => auth.handler(request);
