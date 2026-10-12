import { error } from "@sveltejs/kit";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { posts } from "#lib/server/db/schema.js";

export async function load({ locals, params }) {
	const [post] = await locals.db
		.select()
		.from(posts)
		.where(and(eq(posts.status, "published"), eq(posts.slug, params.slug)));

	if (!post) {
		error(404, "Not found");
	}

	function neighbor(direction: "newer" | "older") {
		if (!post.publishedAt) return;

		return locals.db
			.select({ slug: posts.slug, title: posts.title })
			.from(posts)
			.where(
				and(
					eq(posts.status, "published"),
					eq(posts.category, post.category),
					direction === "newer"
						? gt(posts.publishedAt, post.publishedAt)
						: lt(posts.publishedAt, post.publishedAt),
				),
			)
			.orderBy(direction === "newer" ? asc(posts.publishedAt) : desc(posts.publishedAt))
			.limit(1)
			.then(([p]) => p);
	}

	const [prev, next] = await Promise.all([neighbor("newer"), neighbor("older")]);

	return {
		post,
		prev,
		next,
		seo: {
			path: `/writing/${post.slug}`,
			title: post.title,
			description: post.excerpt,
			image: `/writing/${post.slug}/og`,
			article: true,
		},
	};
}
