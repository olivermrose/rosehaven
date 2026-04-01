import { desc } from "drizzle-orm";
import { posts } from "$lib/server/db/schema";

export async function load({ locals }) {
	const result = await locals.db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			category: posts.category,
			status: posts.status,
			publishedAt: posts.publishedAt,
			updatedAt: posts.updatedAt,
		})
		.from(posts)
		.orderBy(desc(posts.updatedAt));

	return { posts: result };
}
