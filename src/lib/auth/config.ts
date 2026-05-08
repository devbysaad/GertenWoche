/**
 * Auth configuration — reads from environment variables.
 * Set these in .env:
 *   AUTH_SECRET=<random 32+ char string>
 *   AUTH_USERS_FILE=./data/users.json  (optional, defaults to this)
 */

export const AUTH_SECRET = process.env.AUTH_SECRET ?? 'change-me-in-production-32chars!!';
export const COOKIE_NAME = 'gw_session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const USERS_FILE = process.env.AUTH_USERS_FILE ?? './data/users.json';
