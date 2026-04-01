import { invalid, redirect } from "@sveltejs/kit";
import z from "zod";
import { form, getRequestEvent } from "$app/server";
import { createSession, destroySession, verifyPassword } from "./server/auth";

export const login = form(z.object({ password: z.string() }), async (data, issue) => {
	const event = getRequestEvent();

	if (!(await verifyPassword(data.password))) {
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
