import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";
import { slugify } from "$lib/server/util";

export async function load({ params }) {
	const [post] = await db
		.select()
		.from(posts)
		.where(eq(posts.id, Number(params.id)));

	if (!post) {
		error(404, "Post not found");
	}

	return { post };
}

export const actions = {
	save: async ({ request, params }) => {
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

		const id = Number(params.id);
		const [existing] = await db
			.select({ publishedAt: posts.publishedAt })
			.from(posts)
			.where(eq(posts.id, id));

		const slug = slugify(title);
		const publishedAt =
			status === "published" && !existing?.publishedAt ? new Date() : existing?.publishedAt;

		await db
			.update(posts)
			.set({
				title,
				slug,
				category,
				excerpt,
				explicit,
				contentHtml,
				commentary,
				status,
				publishedAt,
				updatedAt: new Date(),
			})
			.where(eq(posts.id, id));

		return { success: true };
	},

	delete: async ({ params }) => {
		await db.delete(posts).where(eq(posts.id, Number(params.id)));
		redirect(303, "/admin/posts");
	},
};
