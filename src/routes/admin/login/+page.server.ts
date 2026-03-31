import { fail, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { createSession, destroySession } from "$lib/server/auth";

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get("password");

		if (typeof password !== "string" || password !== env.ADMIN_PASSWORD) {
			return fail(400, { error: "Invalid password" });
		}

		createSession(cookies);
		redirect(303, "/admin");
	},

	logout: async ({ cookies }) => {
		destroySession(cookies);
		redirect(303, "/admin/login");
	},
};
