export async function load({ parent }) {
	const { posts } = await parent();

	return {
		categories: Object.groupBy(posts, (post) => post.category),
		seo: {
			path: "/writing",
			title: "Writing",
			description: "Poetry, prose poetry, short stories, and dialogue by Oliver Rose.",
		},
	};
}
