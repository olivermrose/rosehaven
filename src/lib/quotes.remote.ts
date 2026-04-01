import { redirect } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { db } from "./server/db";
import { quotes } from "./server/db/schema";

export const getQuote = query(z.coerce.number(), async (id) => {
	return db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
});

export const getQuotes = query(() => {
	return db.select().from(quotes).orderBy(desc(quotes.updatedAt));
});

const quoteSchema = z.object({
	text: z.string().min(1),
	quotee: z.string().min(1),
	sourceTitle: z.string().min(1),
	sourceUrl: z.url().optional(),
});

export const createQuote = form(quoteSchema, async (data) => {
	const [quote] = await db
		.insert(quotes)
		.values({
			text: data.text,
			quotee: data.quotee,
			sourceTitle: data.sourceTitle,
			sourceUrl: data.sourceUrl || null,
		})
		.returning({ id: quotes.id });

	redirect(303, `/admin/quotes/${quote.id}`);
});

export const updateQuote = form(quoteSchema.partial(), async (data) => {
	const event = getRequestEvent();
	const id = Number(event.params.id);

	if (Number.isNaN(id)) {
		redirect(303, "/admin/quotes");
	}

	await db
		.update(quotes)
		.set({
			text: data.text,
			quotee: data.quotee,
			sourceTitle: data.sourceTitle,
			sourceUrl: data.sourceUrl || null,
		})
		.where(eq(quotes.id, id));

	return { success: true };
});

export const deleteQuote = command(z.coerce.number(), async (id) => {
	await db.delete(quotes).where(eq(quotes.id, id));
	redirect(303, "/admin/quotes");
});
