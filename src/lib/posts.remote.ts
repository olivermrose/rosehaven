import { error, redirect } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { db } from "./server/db";
import { posts } from "./server/db/schema";
import { slugify } from "./server/util";

export const getPost = query(z.string(), async (idOrSlug) => {
	const id = Number(idOrSlug);

	const [post] = await db
		.select()
		.from(posts)
		.where(Number.isNaN(id) ? eq(posts.slug, idOrSlug) : eq(posts.id, id));

	if (!post) {
		error(404, "Post not found");
	}

	return post;
});

export const getPosts = query(async () => {
	return db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), asc(posts.slug));
});

const postSchema = z.object({
	title: z.string().min(1),
	category: z.enum(["dialogue", "poetry", "prose-poetry", "short-story"]),
	excerpt: z.string().min(1),
	contentHtml: z.string().min(1),
	commentary: z.string().optional(),
	explicit: z.boolean().default(false),
	status: z.enum(["draft", "published"]).default("draft"),
});

export const createPost = form(postSchema, async (data) => {
	const slug = slugify(data.title);
	const publishedAt = data.status === "published" ? new Date() : null;

	const [post] = await db
		.insert(posts)
		.values({
			title: data.title,
			slug,
			category: data.category,
			excerpt: data.excerpt,
			explicit: data.explicit,
			contentHtml: data.contentHtml,
			commentary: data.commentary || null,
			status: data.status,
			publishedAt,
		})
		.returning({ id: posts.id });

	redirect(303, `/admin/posts/${post.id}`);
});

export const updatePost = form(postSchema.partial(), async (data) => {
	const event = getRequestEvent();
	const id = Number(event.params.id);

	if (Number.isNaN(id)) {
		error(400, "Invalid post ID");
	}

	const [existing] = await db
		.select({ publishedAt: posts.publishedAt })
		.from(posts)
		.where(eq(posts.id, id));

	const slug = data.title ? slugify(data.title) : undefined;
	const publishedAt =
		data.status === "published" && !existing?.publishedAt ? new Date() : existing?.publishedAt;

	await db
		.update(posts)
		.set({
			title: data.title,
			slug,
			category: data.category,
			excerpt: data.excerpt,
			explicit: data.explicit,
			contentHtml: data.contentHtml,
			commentary: data.commentary || null,
			status: data.status,
			publishedAt,
			updatedAt: new Date(),
		})
		.where(eq(posts.id, id));

	return { success: true };
});

export const deletePost = command(z.number(), async (id) => {
	await db.delete(posts).where(eq(posts.id, id));
	redirect(303, "/admin/posts");
});
