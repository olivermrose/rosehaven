import { redirect } from "@sveltejs/kit";
import { verifySession } from "$lib/server/auth";

export async function load({ cookies, url }) {
	const authenticated = verifySession(cookies);

	if (!authenticated && !url.pathname.startsWith("/admin/login")) {
		redirect(303, "/admin/login");
	}

	if (authenticated && url.pathname === "/admin/login") {
		redirect(303, "/admin");
	}

	return { authenticated };
}
