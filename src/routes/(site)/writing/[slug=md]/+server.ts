import { eq } from "drizzle-orm";
import { NodeHtmlMarkdown } from "node-html-markdown";
import type { TranslatorConfigObject } from "node-html-markdown";
import { posts } from "$lib/server/db/schema";

export async function GET({ params, locals }) {
	const slug = params.slug.slice(0, -3);

	const [post] = await locals.db.select().from(posts).where(eq(posts.slug, slug)).limit(1);

	if (!post || post.status !== "published") {
		return new Response("Not found", { status: 404 });
	}

	const translators: TranslatorConfigObject = {};

	if (post.category === "dialogue") {
		translators.p = {
			postprocess({ content, node }) {
				const style = node.getAttribute("style");

				if (style?.endsWith("right")) {
					return `\n\n${content}\n\n`;
				}

				return `\n\n*${content}*\n\n`;
			},
		};
	}

	const markdown = [
		"---",
		`type: ${post.category}`,
		"---",
		"",
		`# ${post.title}`,
		"",
		NodeHtmlMarkdown.translate(post.content, {}, translators),
	].join("\n");

	return new Response(markdown, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
