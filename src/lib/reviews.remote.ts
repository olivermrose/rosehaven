import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";

import { slugify } from "#lib";
import { parseTracklist } from "#lib/tracklist.js";
import { command, form, getRequestEvent, query } from "$app/server";

import { requireAdmin } from "./server/auth";
import { reviews } from "./server/db/schema";
import { lookupAlbum, searchAlbums } from "./server/itunes";

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

	return review;
});

const reviewSchema = z.object({
	title: z.string().min(1),
	artist: z.string().min(1),
	year: z.number().int().optional(),
	artwork: z.url(),
	tracklist: z.string().default(""),
	content: z.string().min(1),
	status: z.enum(["draft", "published"]).default("draft"),
});

export const createReview = form(reviewSchema, async (data) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const [review] = await event.locals.db
		.insert(reviews)
		.values({
			...data,
			slug: slugify(`${data.artist} ${data.title}`),
			tracklist: parseTracklist(data.tracklist),
			publishedAt: data.status === "published" ? new Date() : null,
		})
		.returning({ id: reviews.id });

	redirect(303, `/admin/music/${review.id}`);
});

export const updateReview = form(reviewSchema, async (data) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const id = Number(event.params.id);

	if (Number.isNaN(id)) {
		error(400, "Invalid review ID");
	}

	const [existing] = await event.locals.db
		.select({ publishedAt: reviews.publishedAt })
		.from(reviews)
		.where(eq(reviews.id, id));

	const now = new Date();

	await event.locals.db
		.update(reviews)
		.set({
			...data,
			year: data.year ?? null,
			slug: slugify(`${data.artist} ${data.title}`),
			tracklist: parseTracklist(data.tracklist),
			publishedAt:
				data.status === "published" && !existing?.publishedAt ? now : existing?.publishedAt,
			updatedAt: now,
		})
		.where(eq(reviews.id, id));

	return { success: true };
});

export const deleteReview = command(z.number(), async (id) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	await event.locals.db.delete(reviews).where(eq(reviews.id, id));

	return { success: true };
});
