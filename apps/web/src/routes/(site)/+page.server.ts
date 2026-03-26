import { db } from "$lib/server/db";
import { quotes } from "$lib/server/db/schema";

export async function load() {
	const result = await db.select().from(quotes);

	return {
		quotes: result,
		seo: {
			path: "/",
			title: null,
			description:
				'As I drift off into reverie, I find myself running through a thousand different scenarios of "What if?" My life is not bound by the earth I stand upon.',
		},
	};
}
