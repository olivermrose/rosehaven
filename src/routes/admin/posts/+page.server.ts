import { desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";

export async function load() {
	const result = await db
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
