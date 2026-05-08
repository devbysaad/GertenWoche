/**
 * File-based user store.
 * Reads/writes users to a JSON file at USERS_FILE path.
 * In production, swap this for a real database (SQLite/Postgres).
 */

import fs from 'node:fs';
import path from 'node:path';
import { USERS_FILE } from './config.js';

export interface StoredUser {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	tier: 'free' | 'pro';
	createdAt: string; // ISO string
}

function getFilePath(): string {
	// Resolve relative to project root (process.cwd())
	return path.isAbsolute(USERS_FILE)
		? USERS_FILE
		: path.join(process.cwd(), USERS_FILE);
}

function readUsers(): StoredUser[] {
	const filePath = getFilePath();
	try {
		if (!fs.existsSync(filePath)) return [];
		const raw = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(raw) as StoredUser[];
	} catch {
		return [];
	}
}

function writeUsers(users: StoredUser[]): void {
	const filePath = getFilePath();
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
}

export function findByEmail(email: string): StoredUser | undefined {
	return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findById(id: string): StoredUser | undefined {
	return readUsers().find((u) => u.id === id);
}

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
	const users = readUsers();

	// Check for duplicates
	if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
		throw new Error('EMAIL_EXISTS');
	}
	if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
		throw new Error('USERNAME_EXISTS');
	}

	const user: StoredUser = {
		...data,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString()
	};

	users.push(user);
	writeUsers(users);
	return user;
}
