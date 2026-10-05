import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$app/env/private";

export function handle({ event, resolve }) {
	event.locals.db = drizzle(event.platform?.env.HYPERDRIVE.connectionString ?? DATABASE_URL);

	return resolve(event);
}
