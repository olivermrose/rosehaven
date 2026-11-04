import { Buffer } from "node:buffer";
import { createHmac, scrypt, timingSafeEqual } from "node:crypto";

import { error } from "@sveltejs/kit";
import type { Cookies } from "@sveltejs/kit";

import { ADMIN_PASSWORD_HASH } from "$app/env/private";

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const COOKIE_NAME = "admin_session";

function now(): number {
	return Math.floor(Date.now() / 1000);
}

function sign(issuedAt: number): string {
	return createHmac("sha256", ADMIN_PASSWORD_HASH)
		.update(`rosehaven-admin:${issuedAt}`)
		.digest("hex");
}

export function createSession(cookies: Cookies) {
	const issuedAt = now();

	cookies.set(COOKIE_NAME, `${issuedAt}.${sign(issuedAt)}`, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: SEVEN_DAYS,
	});
}

export function verifySession(cookies: Cookies): boolean {
	const token = cookies.get(COOKIE_NAME);
	if (!token) return false;

	const [issuedAtRaw, signature] = token.split(".");

	if (!issuedAtRaw || !signature || !/^\d+$/.test(issuedAtRaw)) {
		return false;
	}

	const issuedAt = Number(issuedAtRaw);
	const age = now() - issuedAt;

	if (age < 0 || age > SEVEN_DAYS) {
		return false;
	}

	const expected = Buffer.from(sign(issuedAt), "hex");
	const actual = Buffer.from(signature, "hex");

	return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function requireAdmin(cookies: Cookies) {
	if (!verifySession(cookies)) {
		error(401, "Unauthorized");
	}
}

export function destroySession(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: "/" });
}

export function verifyPassword(password: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [salt, hash] = ADMIN_PASSWORD_HASH.split(":");
		const hashBuffer = Buffer.from(hash, "hex");

		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) {
				reject(err);
				return;
			}

			const match = timingSafeEqual(hashBuffer, derivedKey);
			resolve(match);
		});
	});
}
