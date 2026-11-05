import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";

import { slugify } from "#lib";
import { RATING_MAX } from "#lib/tracklist.js";
import { command, form, getRequestEvent, query } from "$app/server";

import { requireAdmin } from "../server/auth";
import { reviews } from "../server/db/schema";
import { lookupAlbum, searchAlbums } from "../server/itunes";
import { createVersioned, deleteVersions, findVersioned, saveVersioned } from "../server/versions";

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

	const review = await findVersioned(event.locals.db, reviews, eq(reviews.id, id));

	if (!review) {
		error(404, "Review not found");
	}

	return review;
});

const trackSchema = z.object({
	title: z.string().trim().min(1),
	duration: z
		.string()
		.trim()
		.regex(/^\d{1,2}(?::\d{2}){1,2}$/, "Durations look like 3:45")
		.optional(),
	rating: z
		.number()
		.int("Ratings must be whole numbers")
		.min(1, "Ratings start at 1")
		.max(RATING_MAX, `Ratings go up to ${RATING_MAX}`)
		.optional(),
});

const reviewSchema = z.object({
	title: z.string().min(1),
	artist: z.string().min(1),
	year: z.number().int().optional(),
	artwork: z.url(),
	tracklist: z
		.string()
		.default("[]")
		.transform((value, ctx) => {
			try {
				return JSON.parse(value) as unknown;
			} catch {
				ctx.addIssue({ code: "custom", message: "Tracklist is malformed" });
				return z.NEVER;
			}
		})
		.pipe(z.array(trackSchema)),
	content: z.string().min(1),
	intent: z.enum(["save", "publish", "unpublish"]).default("save"),
});

function toFields({ year, ...rest }: Omit<z.infer<typeof reviewSchema>, "intent">) {
	return { ...rest, year: year ?? null };
}

export const createReview = form(reviewSchema, async ({ intent, ...data }) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const fields = toFields(data);

	const id = await createVersioned(
		event.locals.db,
		reviews,
		intent,
		{
			...fields,
			slug: slugify(`${fields.artist} ${fields.title}`),
		},
		fields,
	);

	redirect(303, `/admin/music/${id}`);
});

export const updateReview = form(reviewSchema, async ({ intent, ...data }) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	const id = Number(event.params.id);

	if (Number.isNaN(id)) {
		error(400, "Invalid review ID");
	}

	const fields = toFields(data);

	const found = await saveVersioned(event.locals.db, reviews, id, intent, fields, () => ({
		...fields,
		slug: slugify(`${fields.artist} ${fields.title}`),
	}));

	if (!found) {
		error(404, "Review not found");
	}

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
