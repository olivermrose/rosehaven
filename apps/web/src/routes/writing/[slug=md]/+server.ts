import Turndown from "turndown";
import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { payloadResponse, postSchema } from "$lib/schema";

const turndown = new Turndown();

turndown.addRule("speaker", {
	filter: "p",
	replacement(content, node) {
		if (node.style.textAlign === "right") {
			return `\n\n${content}\n\n`;
		}

		return `\n\n*${content}*\n\n`;
	},
});

export async function GET({ params }) {
	const postsResponse = await fetch(
		`${PUBLIC_CMS_API_URL}/posts?where[_status][equals]=published&pagination=false`,
	);
	const { docs } = await payloadResponse(postsResponse, postSchema);

	const post = docs.find((post) => post.slug === params.slug.slice(0, -3));

	if (!post) {
		return new Response("Not found", { status: 404 });
	}

	let markdown = turndown.turndown(post.contentHtml);
	markdown = `# ${post.title}\n\n${markdown}`;

	return new Response(markdown, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
