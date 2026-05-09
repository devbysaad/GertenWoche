import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Ensure the data directory exists before opening the DB
const dataDir = resolve('./data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

export const auth = betterAuth({
	database: new Database(resolve('./data/auth.db')),
	baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:5173',
	secret: process.env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		minPasswordLength: 8
	},
	session: {
		cookieName: 'gartenwoche_session',
		expiresIn:  60 * 60 * 24 * 30,
		updateAge:  60 * 60 * 24
	}
});
