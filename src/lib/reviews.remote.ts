import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";

import { slugify } from "#lib";
import { parseTracklist } from "#lib/tracklist.js";
import { command, form, getRequestEvent, query } from "$app/server";

import { requireAdmin } from "./server/auth";
import { reviews } from "./server/db/schema";
import { lookupAlbum, searchAlbums } from "./server/itunes";
import { createVersion, deleteVersions, withLatestVersion } from "./server/versions";

export const findAlbums = query(z.string().trim().min(2), (term) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	return searchAlbums(term);
});

export const getAlbum = query(
	z.object({ id: z.number().int(), country: z.string().length(2).default("us") }),
	async ({ id, country }) => {
		const event = getRequestEvent();
		requireAdmin(event.cookies);

		const album = await lookupAlbum(id, country);

		if (!album) {
			error(404, "Album not found");
		}

		return album;
	},
);

export const getReview = query(z.number(), async (id) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const [review] = await event.locals.db.select().from(reviews).where(eq(reviews.id, id));

	if (!review) {
		error(404, "Review not found");
	}

	return withLatestVersion(event.locals.db, reviews, review);
});

const reviewSchema = z.object({
	title: z.string().min(1),
	artist: z.string().min(1),
	year: z.number().int().optional(),
	artwork: z.url(),
	tracklist: z.string().default(""),
	content: z.string().min(1),
	intent: z.enum(["save", "publish", "unpublish"]).default("save"),
});

function toFields({ year, tracklist, ...rest }: Omit<z.infer<typeof reviewSchema>, "intent">) {
	return { ...rest, year: year ?? null, tracklist: parseTracklist(tracklist) };
}

export const createReview = form(reviewSchema, async ({ intent, ...data }) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const fields = toFields(data);
	const publishedAt = intent === "publish" ? new Date() : null;

	const id = await event.locals.db.transaction(async (tx) => {
		const [review] = await tx
			.insert(reviews)
			.values({
				...fields,
				slug: slugify(`${fields.artist} ${fields.title}`),
				status: publishedAt ? "published" : "draft",
				publishedAt,
			})
			.returning({ id: reviews.id });

		await createVersion(tx, reviews, review.id, fields, publishedAt);

		return review.id;
	});

	redirect(303, `/admin/music/${id}`);
});

export const updateReview = form(reviewSchema, async ({ intent, ...data }) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const id = Number(event.params.id);

	if (Number.isNaN(id)) {
		error(400, "Invalid review ID");
	}

	const [existing] = await event.locals.db
		.select({ status: reviews.status, publishedAt: reviews.publishedAt })
		.from(reviews)
		.where(eq(reviews.id, id));

	if (!existing) {
		error(404, "Review not found");
	}

	const fields = toFields(data);
	const now = new Date();

	await event.locals.db.transaction(async (tx) => {
		// saving a published review only records a version; the live row stays
		// untouched until the changes are published
		if (intent === "save" && existing.status === "published") {
			await tx.update(reviews).set({ updatedAt: now }).where(eq(reviews.id, id));
			await createVersion(tx, reviews, id, fields);
			return;
		}

		const publish = intent === "publish";

		await tx
			.update(reviews)
			.set({
				...fields,
				slug: slugify(`${fields.artist} ${fields.title}`),
				status: publish ? "published" : "draft",
				publishedAt: publish ? (existing.publishedAt ?? now) : existing.publishedAt,
				updatedAt: now,
			})
			.where(eq(reviews.id, id));

		await createVersion(tx, reviews, id, fields, publish ? now : null);
	});

	return { success: true, intent };
});

export const deleteReview = command(z.number(), async (id) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	await event.locals.db.transaction(async (tx) => {
		await tx.delete(reviews).where(eq(reviews.id, id));
		await deleteVersions(tx, reviews, id);
	});

	return { success: true };
});
