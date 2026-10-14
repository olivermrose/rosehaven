import { error } from "@sveltejs/kit";
import { eq, getColumns, sql } from "drizzle-orm";

import { posts } from "#lib/server/db/schema.js";

const order = sql`OVER (
	PARTITION BY ${posts.category}
	ORDER BY
		${posts.publishedAt} DESC,
		${posts.id} DESC
)`;

export async function load({ locals, params }) {
	const ranked = locals.db
		.select({
			...getColumns(posts),
			prevSlug: sql<string | null>`lag(${posts.slug}) ${order}`.as("prev_slug"),
			prevTitle: sql<string | null>`lag(${posts.title}) ${order}`.as("prev_title"),
			nextSlug: sql<string | null>`lead(${posts.slug}) ${order}`.as("next_slug"),
			nextTitle: sql<string | null>`lead(${posts.title}) ${order}`.as("next_title"),
		})
		.from(posts)
		.where(eq(posts.status, "published"))
		.as("ranked");

	const [row] = await locals.db.select().from(ranked).where(eq(ranked.slug, params.slug));

	if (!row) {
		error(404, "Not found");
	}

	const { prevSlug, prevTitle, nextSlug, nextTitle, ...post } = row;

	return {
		post,
		prev: prevSlug && prevTitle ? { slug: prevSlug, title: prevTitle } : undefined,
		next: nextSlug && nextTitle ? { slug: nextSlug, title: nextTitle } : undefined,
		seo: {
			path: `/writing/${post.slug}`,
			title: post.title,
			description: post.excerpt,
			image: `/writing/${post.slug}/og`,
			article: true,
		},
	};
}
