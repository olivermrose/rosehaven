import { error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { quotes } from "$lib/server/db/schema";

export async function load({ params }) {
	const [quote] = await db
		.select()
		.from(quotes)
		.where(eq(quotes.id, Number(params.id)));

	if (!quote) {
		throw error(404, "Quote not found");
	}

	return { quote };
}

export const actions = {
	save: async ({ request, params }) => {
		const data = await request.formData();

		const text = data.get("text") as string;
		const quotee = data.get("quotee") as string;
		const sourceTitle = data.get("sourceTitle") as string;
		const sourceUrl = (data.get("sourceUrl") as string) || null;

		if (!text || !quotee || !sourceTitle) {
			return fail(400, { error: "Text, quotee, and source title are required." });
		}

		await db
			.update(quotes)
			.set({ text, quotee, sourceTitle, sourceUrl, updatedAt: new Date() })
			.where(eq(quotes.id, Number(params.id)));

		return { success: true };
	},

	delete: async ({ params }) => {
		await db.delete(quotes).where(eq(quotes.id, Number(params.id)));
		throw redirect(303, "/admin/quotes");
	},
};
