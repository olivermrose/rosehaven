import { Buffer } from "node:buffer";
import { createHmac, scrypt, timingSafeEqual } from "node:crypto";
import type { Cookies } from "@sveltejs/kit";
import { ADMIN_PASSWORD_HASH } from "$env/static/private";

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const COOKIE_NAME = "admin_session";

function getSessionToken(): string {
	return createHmac("sha256", ADMIN_PASSWORD_HASH).update("rosehaven-admin").digest("hex");
}

export function createSession(cookies: Cookies) {
	cookies.set(COOKIE_NAME, getSessionToken(), {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: SEVEN_DAYS,
	});
}

export function verifySession(cookies: Cookies): boolean {
	return cookies.get(COOKIE_NAME) === getSessionToken();
}

export function destroySession(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: "/" });
}

export function verifyPassword(password: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [salt, hash] = ADMIN_PASSWORD_HASH.split(":");
		const hashBuffer = Buffer.from(hash, "hex");

		scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);

			const match = timingSafeEqual(hashBuffer, derivedKey);
			resolve(match);
		});
	});
}
