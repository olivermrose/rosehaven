import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$env/static/private";

export function handle({ event, resolve }) {
	event.locals.db = drizzle(event.platform?.env.HYPERDRIVE.connectionString ?? DATABASE_URL);

	return resolve(event);
}
