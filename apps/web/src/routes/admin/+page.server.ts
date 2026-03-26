import { count, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { posts, quotes } from "$lib/server/db/schema";

export async function load() {
	const [postStats] = await db
		.select({
			total: count(),
			published: sql<number>`count(*) filter (where ${posts.status} = 'published')`,
		})
		.from(posts);

	const [quoteStats] = await db.select({ total: count() }).from(quotes);

	return {
		stats: {
			posts: postStats.total,
			published: postStats.published,
			drafts: postStats.total - postStats.published,
			quotes: quoteStats.total,
		},
	};
}
