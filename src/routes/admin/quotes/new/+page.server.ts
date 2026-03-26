import { fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { quotes } from "$lib/server/db/schema";

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const text = data.get("text") as string;
		const quotee = data.get("quotee") as string;
		const sourceTitle = data.get("sourceTitle") as string;
		const sourceUrl = (data.get("sourceUrl") as string) || null;

		if (!text || !quotee || !sourceTitle) {
			return fail(400, { error: "Text, quotee, and source title are required." });
		}

		const [quote] = await db
			.insert(quotes)
			.values({ text, quotee, sourceTitle, sourceUrl })
			.returning({ id: quotes.id });

		throw redirect(303, `/admin/quotes/${quote.id}`);
	},
};
