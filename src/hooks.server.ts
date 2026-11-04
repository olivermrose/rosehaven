import { redirect } from "@sveltejs/kit";
import { drizzle } from "drizzle-orm/node-postgres";

import { verifySession } from "#lib/server/auth.js";
import { DATABASE_URL } from "$app/env/private";

export function handle({ event, resolve }) {
	event.locals.db = drizzle(event.platform?.env.HYPERDRIVE.connectionString ?? DATABASE_URL);

	const { pathname } = event.url;
	const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

	if (isAdminRoute && pathname !== "/admin/login" && !verifySession(event.cookies)) {
		redirect(303, "/admin/login");
	}

	return resolve(event);
}
