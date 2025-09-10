import { injectAnalytics } from "@vercel/analytics/sveltekit";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { payloadResponse, postSchema } from "$lib/schema";

injectAnalytics();
injectSpeedInsights();

export async function load({ fetch }) {
	const postsResponse = await fetch(
		`${PUBLIC_CMS_API_URL}/posts?where[_status][equals]=published&sort=category,slug&pagination=false`,
	);
	const posts = await payloadResponse(postsResponse, postSchema);

	return {
		posts: posts.docs,
	};
}
