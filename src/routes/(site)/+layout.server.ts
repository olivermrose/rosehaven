import { asc, eq } from "drizzle-orm";
import { posts } from "$lib/server/db/schema";

export async function load({ locals }) {
	const result = await locals.db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), asc(posts.slug));

	return { posts: result };
}
