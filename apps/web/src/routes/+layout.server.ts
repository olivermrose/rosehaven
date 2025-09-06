import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { payloadResponse, postSchema } from "$lib/schema";

export async function load({ fetch }) {
	const postsResponse = await fetch(
		`${PUBLIC_CMS_API_URL}/posts?sort=category,title&pagination=false`,
	);
	const posts = await payloadResponse(postsResponse, postSchema);

	return {
		posts: posts.docs,
	};
}
