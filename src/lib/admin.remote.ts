import { Buffer } from "node:buffer";
import { verify } from "@node-rs/argon2";
import { invalid, redirect } from "@sveltejs/kit";
import z from "zod";
import { form, getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { createSession, destroySession } from "./server/auth";

export const login = form(z.object({ password: z.string() }), async (data, issue) => {
	const event = getRequestEvent();

	const hash = Buffer.from(env.ADMIN_PASSWORD_HASH, "base64");
	const valid = await verify(hash, data.password);

	if (!valid) {
		invalid(issue.password("Incorrect password"));
	}

	createSession(event.cookies);
	redirect(303, "/admin");
});

export const logout = form(() => {
	const event = getRequestEvent();

	destroySession(event.cookies);
	redirect(303, "/admin/login");
});
