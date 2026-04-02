import { eq } from "drizzle-orm";
import Turndown from "turndown";
import { posts } from "$lib/server/db/schema";

const turndown = new Turndown();

export async function GET({ params, locals }) {
	const slug = params.slug.slice(0, -3);

	const [post] = await locals.db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

	if (!post || post.status !== "published") {
		return new Response("Not found", { status: 404 });
	}

	if (post.category === "dialogue") {
		turndown.addRule("speaker", {
			filter: "p",
			replacement(content, node) {
				if ((node as HTMLElement).style.textAlign === "right") {
					return `\n\n${content}\n\n`;
				}

				return `\n\n*${content}*\n\n`;
			},
		});
	}

	let markdown = turndown.turndown(post.content);
	markdown = `# ${post.title}\n\n${markdown}`;

	return new Response(markdown, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
