import { desc, eq } from "drizzle-orm";
import z from "zod";
import { command, form, getRequestEvent, query } from "$app/server";
import { requireAdmin } from "./server/auth";
import { quotes } from "./server/db/schema";

export const getQuotes = query(() => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	return event.locals.db.select().from(quotes).orderBy(desc(quotes.createdAt));
});

export const createQuote = form(
	z.object({
		text: z.string().min(1),
		quotee: z.string().min(1),
		sourceTitle: z.string().min(1),
		sourceUrl: z.url().or(z.literal("")).optional(),
	}),
	async (data) => {
		const event = getRequestEvent();
		requireAdmin(event.cookies);

		await event.locals.db.insert(quotes).values({ ...data, sourceUrl: data.sourceUrl || null });
		await getQuotes().refresh();
	},
);

export const deleteQuote = command(z.number(), async (id) => {
	const event = getRequestEvent();
	requireAdmin(event.cookies);

	await event.locals.db.delete(quotes).where(eq(quotes.id, id));
	await getQuotes().refresh();
});
