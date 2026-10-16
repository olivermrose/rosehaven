import { asc, desc, eq } from "drizzle-orm";

import { posts } from "#lib/server/db/schema.js";

export async function load({ locals }) {
	const result = await locals.db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), desc(posts.publishedAt), desc(posts.id));

	return {
		categories: Object.groupBy(result, (p) => p.category),
		seo: {
			path: "/writing",
			title: "Writing",
			description:
				'As I drift off into reverie, I find myself running through a thousand different scenarios of "What if?" My life is not bound by the earth I stand upon.',
		},
	};
}
