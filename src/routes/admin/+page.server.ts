import { count, sql } from "drizzle-orm";
import { posts, quotes } from "$lib/server/db/schema";

export async function load({ locals }) {
	const [postStats] = await locals.db
		.select({
			total: count(),
			published: sql<number>`count(*) filter (where ${posts.status} = 'published')`,
		})
		.from(posts);

	const [quoteStats] = await locals.db.select({ total: count() }).from(quotes);

	return {
		stats: {
			posts: postStats.total,
			published: postStats.published,
			drafts: postStats.total - postStats.published,
			quotes: quoteStats.total,
		},
	};
}
