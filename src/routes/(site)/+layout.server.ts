import { desc, eq, sql } from "drizzle-orm";
import { verifySession } from "#lib/server/auth.js";
import { posts } from "#lib/server/db/schema.js";

export async function load({ locals, cookies }) {
	const authenticated = verifySession(cookies);

	const result = await locals.db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(sql`${posts.category}::text`, desc(posts.publishedAt));

	return { posts: result, authenticated };
}
