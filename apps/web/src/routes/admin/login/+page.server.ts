import { fail, redirect } from "@sveltejs/kit";
import { ADMIN_PASSWORD } from "$env/static/private";
import { createSession, destroySession } from "$lib/server/auth";

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get("password");

		if (typeof password !== "string" || password !== ADMIN_PASSWORD) {
			return fail(400, { error: "Invalid password" });
		}

		createSession(cookies);
		throw redirect(303, "/admin");
	},

	logout: async ({ cookies }) => {
		destroySession(cookies);
		throw redirect(303, "/admin/login");
	},
};
