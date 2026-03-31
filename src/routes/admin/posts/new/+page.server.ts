import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";
import { slugify } from "$lib/server/util";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get("title") as string;
		const category = data.get("category") as "dialogue" | "poetry" | "prose-poetry" | "short-story";
		const excerpt = data.get("excerpt") as string;
		const explicit = data.get("explicit") === "on";
		const contentHtml = data.get("contentHtml") as string;
		const commentary = (data.get("commentary") as string) || null;
		const status = (data.get("status") as "draft" | "published") || "draft";

		if (!title || !category || !excerpt || !contentHtml) {
			return fail(400, { error: "Title, category, excerpt, and content are required." });
		}

		const slug = slugify(title);
		const publishedAt = status === "published" ? new Date() : null;

		const [post] = await db
			.insert(posts)
			.values({
				title,
				slug,
				category,
				excerpt,
				explicit,
				contentHtml,
				commentary,
				status,
				publishedAt,
			})
			.returning({ id: posts.id });

		redirect(303, `/admin/posts/${post.id}`);
	},
};
