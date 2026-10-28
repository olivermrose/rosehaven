import { error, redirect } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
import z from "zod";

import { slugify } from "#lib";
import { command, form, getRequestEvent, query } from "$app/server";

import { requireAdmin } from "./server/auth";
import { posts } from "./server/db/schema";
import { createVersion, deleteVersions, withLatestVersion } from "./server/versions";

export const getPost = query(z.string(), async (idOrSlug) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const id = Number(idOrSlug);

	const [post] = await event.locals.db
		.select()
		.from(posts)
		.where(Number.isNaN(id) ? eq(posts.slug, idOrSlug) : eq(posts.id, id));

	if (!post) {
		error(404, "Post not found");
	}

	return withLatestVersion(event.locals.db, posts, post);
});

export const getPosts = query(() => {
	const event = getRequestEvent();

	return event.locals.db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), asc(posts.slug));
});

const postSchema = z.object({
	title: z.string().min(1),
	category: z.enum(["dialogue", "poetry", "prose poetry", "short story"]),
	excerpt: z.string().min(1),
	content: z.string().min(1),
	explicit: z.boolean().default(false),
	intent: z.enum(["save", "publish", "unpublish"]).default("save"),
});

export const createPost = form(postSchema, async ({ intent, ...fields }) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const publishedAt = intent === "publish" ? new Date() : null;

	const id = await event.locals.db.transaction(async (tx) => {
		const [post] = await tx
			.insert(posts)
			.values({
				...fields,
				slug: slugify(fields.title),
				status: publishedAt ? "published" : "draft",
				publishedAt,
			})
			.returning({ id: posts.id });

		await createVersion(tx, posts, post.id, fields, publishedAt);

		return post.id;
	});

	redirect(303, `/admin/writing/${id}`);
});

export const updatePost = form(
	postSchema.extend({
		revision: z.boolean().default(false),
	}),
	async ({ intent, revision, ...fields }) => {
		const event = getRequestEvent();
		requireAdmin(event.cookies);

		const id = Number(event.params.id);

		if (Number.isNaN(id)) {
			error(400, "Invalid post ID");
		}

		const [existing] = await event.locals.db
			.select({
				status: posts.status,
				publishedAt: posts.publishedAt,
				revisedAt: posts.revisedAt,
			})
			.from(posts)
			.where(eq(posts.id, id));

		if (!existing) {
			error(404, "Post not found");
		}

		const now = new Date();

		await event.locals.db.transaction(async (tx) => {
			// saving a published post only records a version; the live row stays
			// untouched until the changes are published
			if (intent === "save" && existing.status === "published") {
				await tx.update(posts).set({ updatedAt: now }).where(eq(posts.id, id));
				await createVersion(tx, posts, id, fields);
				return;
			}

			const publish = intent === "publish";

			await tx
				.update(posts)
				.set({
					...fields,
					slug: slugify(fields.title),
					status: publish ? "published" : "draft",
					publishedAt: publish ? (existing.publishedAt ?? now) : existing.publishedAt,
					revisedAt:
						publish && revision && existing.publishedAt ? now : existing.revisedAt,
					updatedAt: now,
				})
				.where(eq(posts.id, id));

			await createVersion(tx, posts, id, fields, publish ? now : null);
		});

		return { success: true, intent };
	},
);

export const deletePost = command(z.number(), async (id) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	await event.locals.db.transaction(async (tx) => {
		await tx.delete(posts).where(eq(posts.id, id));
		await deleteVersions(tx, posts, id);
	});

	return { success: true };
});
