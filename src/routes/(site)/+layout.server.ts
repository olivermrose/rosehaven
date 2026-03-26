import { asc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";

export async function load() {
	const result = await db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), asc(posts.slug));

	return { posts: result };
}
