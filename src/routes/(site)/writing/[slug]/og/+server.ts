import { ImageResponse } from "takumi-js/response";
import { eq } from "drizzle-orm";
import { dev } from "$app/environment";
import { posts } from "$lib/server/db/schema";
import { render } from "svelte/server";
import Template from "./Template.svelte";
import styles from "../../../../../app.css?inline";

export async function GET({ params, locals }) {
	const [post] = await locals.db
		.select({ title: posts.title, excerpt: posts.excerpt })
		.from(posts)
		.where(eq(posts.slug, params.slug));

	const { body, head } = await render(Template, {
		props: {
			title: post.title,
			excerpt: post.excerpt,
		},
	});

	return new ImageResponse(head + body, {
		stylesheets: [styles],
		width: 1200,
		height: 630,
		format: "webp",
		headers: {
			// 31536000 = 365 days
			"Cache-Control": dev
				? "no-cache, no-store"
				: "public, immutable, no-transform, max-age=31536000",
		},
	});
}
