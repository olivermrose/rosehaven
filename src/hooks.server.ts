import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "$env/static/private";

export async function handle({ event, resolve }) {
	if (!event.platform) {
		event.locals.db = drizzle(DATABASE_URL);
	} else {
		event.locals.db = drizzle(event.platform.env.HYPERDRIVE.connectionString);
	}

	return resolve(event);
}
