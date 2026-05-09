import { betterAuth } from 'better-auth';
import { createClient } from '@libsql/client';

const dbUrl = process.env.DATABASE_URL ?? 'file:./data/auth.db';
const secret = process.env.BETTER_AUTH_SECRET;

// During build (vite build) there is no secret — allow it but warn.
// At runtime on Vercel the env var must be set or requests will fail.
if (!secret) {
	console.warn('[auth] BETTER_AUTH_SECRET is not set. Set it in .env and on Vercel.');
}

const client = createClient({ url: dbUrl });

export const auth = betterAuth({
	database: {
		db: client,
		type: 'sqlite'
	},
	baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:5173',
	secret: secret ?? 'build-time-placeholder-replace-in-env',
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 8
	},
	session: {
		cookieName: 'gartenwoche_session',
		expiresIn: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24
	}
});
