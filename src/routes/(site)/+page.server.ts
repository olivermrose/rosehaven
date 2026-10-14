import { sql } from "drizzle-orm";

import { quotes } from "#lib/server/db/schema.js";

export async function load({ locals }) {
	const [quote] = await locals.db
		.select()
		.from(quotes)
		.orderBy(sql`random()`)
		.limit(1);

	return {
		quote,
		seo: {
			path: "/",
			title: null,
			description:
				'As I drift off into reverie, I find myself running through a thousand different scenarios of "What if?" My life is not bound by the earth I stand upon.',
		},
	};
}
