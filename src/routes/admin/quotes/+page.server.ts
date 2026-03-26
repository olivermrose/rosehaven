import { desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import { quotes } from "$lib/server/db/schema";

export async function load() {
	const result = await db
		.select()
		.from(quotes)
		.orderBy(desc(quotes.updatedAt));

	return { quotes: result };
}
