import { env } from "$env/dynamic/public";
import { payloadResponse, postSchema } from "$lib/schema";

export async function load({ fetch }) {
	const postsResponse = await fetch(
		`${env.PUBLIC_CMS_API_URL}/posts?where[_status][equals]=published&sort=category,slug&pagination=false`,
	);
	const posts = await payloadResponse(postsResponse, postSchema);

	return {
		posts: posts.docs,
	};
}
