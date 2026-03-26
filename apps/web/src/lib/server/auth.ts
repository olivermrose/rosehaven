import { createHmac } from "node:crypto";
import type { Cookies } from "@sveltejs/kit";
import { ADMIN_PASSWORD } from "$env/static/private";

const SEVEN_DAYS = 60 * 60 * 24 * 7;
const COOKIE_NAME = "admin_session";

function getSessionToken(): string {
	return createHmac("sha256", ADMIN_PASSWORD).update("rosehaven-admin").digest("hex");
}

export function createSession(cookies: Cookies) {
	cookies.set(COOKIE_NAME, getSessionToken(), {
		path: "/admin",
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
	cookies.delete(COOKIE_NAME, { path: "/admin" });
}
