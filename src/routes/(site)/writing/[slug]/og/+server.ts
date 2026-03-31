import { ImageResponse } from "@takumi-rs/image-response/wasm";
import { eq } from "drizzle-orm";
import { dev } from "$app/environment";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";
import { template } from "./template";

export async function GET({ params }) {
	const [post] = await db
		.select({ title: posts.title, excerpt: posts.excerpt })
		.from(posts)
		.where(eq(posts.slug, params.slug));

	return new ImageResponse(
		template({
			title: post.title,
			excerpt: post.excerpt,
		}),
		{
			width: 1200,
			height: 630,
			format: "webp",
			headers: {
				// 31536000 = 365 days
				"Cache-Control": dev
					? "no-cache, no-store"
					: "public, immutable, no-transform, max-age=31536000",
			},
		},
	);
}
