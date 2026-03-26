import { injectAnalytics } from "@vercel/analytics/sveltekit";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
import { asc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { posts } from "$lib/server/db/schema";

injectAnalytics();
injectSpeedInsights();

export async function load() {
	const result = await db
		.select()
		.from(posts)
		.where(eq(posts.status, "published"))
		.orderBy(asc(posts.category), asc(posts.slug));

	return { posts: result };
}
