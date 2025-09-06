import { error } from "@sveltejs/kit";

export async function load({ parent, params }) {
	const { posts } = await parent();
	const post = posts.find((post) => post.slug === params.slug);

	if (!post) {
		throw error(404, { message: "Not found" });
	}

	const categorized = posts.filter((p) => p.category === post.category);
	const position = categorized.indexOf(post);

	return {
		post,
		// NOTE: Not using .at() to avoid wrapping around
		prev: categorized[position - 1],
		next: categorized[position + 1],
		seo: {
			path: `/writing/${post.slug}`,
			title: post.title,
			description: post.excerpt,
			article: true,
		},
	};
}
