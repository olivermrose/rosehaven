import { desc, eq } from "drizzle-orm";
import { reviews } from "#lib/server/db/schema.js";

export async function load({ locals }) {
	const result = await locals.db
		.select({
			id: reviews.id,
			title: reviews.title,
			artist: reviews.artist,
			year: reviews.year,
			slug: reviews.slug,
			artwork: reviews.artwork,
			publishedAt: reviews.publishedAt,
		})
		.from(reviews)
		.where(eq(reviews.status, "published"))
		.orderBy(desc(reviews.publishedAt));

	return {
		reviews: result,
		seo: {
			path: "/music",
			title: "Music",
		},
	};
}
