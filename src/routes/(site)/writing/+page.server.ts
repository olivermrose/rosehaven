import { eq, sql, desc } from "drizzle-orm";
import { posts } from "#lib/server/db/schema.js";

export async function load({ locals }) {
	const result = await locals.db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(sql`${posts.category}::text`, desc(posts.publishedAt));

	return {
		categories: Object.groupBy(result, (p) => p.category),
		seo: {
			path: "/writing",
			title: "Writing",
		},
	};
}
