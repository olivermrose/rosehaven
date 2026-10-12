import { desc } from "drizzle-orm";
import { reviews } from "#lib/server/db/schema.js";

export async function load({ locals }) {
	const result = await locals.db
		.select({
			id: reviews.id,
			title: reviews.title,
			artist: reviews.artist,
			status: reviews.status,
			publishedAt: reviews.publishedAt,
			updatedAt: reviews.updatedAt,
		})
		.from(reviews)
		.orderBy(desc(reviews.updatedAt));

	return { reviews: result };
}
