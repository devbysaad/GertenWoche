/**
 * Session management using signed JWT-like tokens in HttpOnly cookies.
 * Uses Web Crypto API (built into Node 18+) — no extra dependencies.
 */

import { AUTH_SECRET, COOKIE_NAME, COOKIE_MAX_AGE } from './config.js';
import type { Cookies } from '@sveltejs/kit';

interface SessionPayload {
	userId: string;
	tier: 'free' | 'pro';
	exp: number; // Unix timestamp
}

// ── HMAC signing with Web Crypto ────────────────────────────────────────────

async function getCryptoKey(): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(AUTH_SECRET),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

function b64url(buf: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buf)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

async function signToken(payload: SessionPayload): Promise<string> {
	const key = await getCryptoKey();
	const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256' })));
	const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
	const sig = b64url(
		await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${body}`))
	);
	return `${header}.${body}.${sig}`;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
	try {
		const [header, body, sig] = token.split('.');
		if (!header || !body || !sig) return null;

		const key = await getCryptoKey();
		const valid = await crypto.subtle.verify(
			'HMAC',
			key,
			Uint8Array.from(atob(sig.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
			new TextEncoder().encode(`${header}.${body}`)
		);
		if (!valid) return null;

		const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/'))) as SessionPayload;
		if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expired

		return payload;
	} catch {
		return null;
	}
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Create a session cookie for a user after login/register */
export async function createSession(
	cookies: Cookies,
	userId: string,
	tier: 'free' | 'pro'
): Promise<void> {
	const payload: SessionPayload = {
		userId,
		tier,
		exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE
	};
	const token = await signToken(payload);

	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: COOKIE_MAX_AGE
	});
}

/** Validate session from incoming cookies — returns payload or null */
export async function getSession(cookies: Cookies): Promise<SessionPayload | null> {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return null;
	return verifyToken(token);
}

/** Destroy the session cookie (logout) */
export function destroySession(cookies: Cookies): void {
	cookies.delete(COOKIE_NAME, { path: '/' });
}
