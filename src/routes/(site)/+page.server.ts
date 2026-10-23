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
		preload: ["https://assets.olivermrose.com/self.jpg"],
		seo: {
			path: "/",
			title: null,
			description:
				"I'm a front-end engineer with full-stack experience. I enjoy building web applications, exploring new technologies, and expressing myself through creative writing.",
		},
	};
}
