import { desc } from "drizzle-orm";

import { reviews } from "#lib/server/db/schema.js";
import { withUnpublishedChanges } from "#lib/server/versions.js";

export async function load({ locals }) {
	const [result, unpublished] = await Promise.all([
		locals.db
			.select({
				id: reviews.id,
				title: reviews.title,
				artist: reviews.artist,
				year: reviews.year,
				artwork: reviews.artwork,
				status: reviews.status,
				publishedAt: reviews.publishedAt,
				updatedAt: reviews.updatedAt,
			})
			.from(reviews)
			.orderBy(desc(reviews.updatedAt)),
		withUnpublishedChanges(locals.db, reviews),
	]);

	return {
		reviews: result.map((review) => ({
			...review,
			pending: review.status === "published" && unpublished.has(review.id),
		})),
	};
}
