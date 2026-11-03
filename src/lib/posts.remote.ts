import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";

import { slugify } from "#lib";
import { command, form, getRequestEvent, query } from "$app/server";

import { requireAdmin } from "./server/auth";
import { posts } from "./server/db/schema";
import { createVersioned, deleteVersions, findVersioned, saveVersioned } from "./server/versions";

export const getPost = query(z.string(), async (idOrSlug) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const id = Number(idOrSlug);

	const post = await findVersioned(
		event.locals.db,
		posts,
		Number.isNaN(id) ? eq(posts.slug, idOrSlug) : eq(posts.id, id),
	);

	if (!post) {
		error(404, "Post not found");
	}

	return post;
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

	const id = await createVersioned(
		event.locals.db,
		posts,
		intent,
		{ ...fields, slug: slugify(fields.title) },
		fields,
	);

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

		const found = await saveVersioned(event.locals.db, posts, id, intent, fields, (ctx) => ({
			...fields,
			slug: slugify(fields.title),
			revisedAt: ctx.publish && revision && ctx.existing.publishedAt ? ctx.now : undefined,
		}));

		if (!found) {
			error(404, "Post not found");
		}

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
