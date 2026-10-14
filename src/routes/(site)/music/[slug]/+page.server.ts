import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

import { reviews } from "#lib/server/db/schema.js";

export async function load({ locals, params }) {
	const [review] = await locals.db
		.select()
		.from(reviews)
		.where(and(eq(reviews.slug, params.slug), eq(reviews.status, "published")));

	if (!review) {
		error(404, "Not found");
	}

	return {
		review,
		seo: {
			path: `/music/${review.slug}`,
			title: `${review.title} by ${review.artist}`,
			description: `A review of ${review.title} by ${review.artist}.`,
			image: review.artwork,
			article: true,
		},
	};
}
