import { desc } from "drizzle-orm";

import { posts } from "#lib/server/db/schema.js";
import { withUnpublishedChanges } from "#lib/server/versions.js";

export async function load({ locals }) {
	const [result, unpublished] = await Promise.all([
		locals.db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				category: posts.category,
				explicit: posts.explicit,
				status: posts.status,
				publishedAt: posts.publishedAt,
				updatedAt: posts.updatedAt,
			})
			.from(posts)
			.orderBy(desc(posts.updatedAt)),
		withUnpublishedChanges(locals.db, posts),
	]);

	return {
		posts: result.map((post) => ({
			...post,
			pending: post.status === "published" && unpublished.has(post.id),
		})),
	};
}
