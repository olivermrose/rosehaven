import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { z } from "zod";

const metadata = z.object({
	id: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

const quoteSchema = metadata.extend({
	text: z.string(),
	quotee: z.string(),
	sourceTitle: z.string(),
	sourceUrl: z.string().optional(),
});

const postSchema = metadata.extend({
	publishedAt: z.iso.datetime().optional(),
	category: z.enum(["dialogue", "poetry", "prose-poetry", "short-story"]),
	slug: z.string(),
	title: z.string(),
	excerpt: z.string().optional(),
	explicit: z.boolean(),
	contentHtml: z.string(),
});

async function payloadResponse<T extends z.ZodObject>(response: Response, schema: T) {
	const body = await response.json();

	const payloadSchema = z.object({
		docs: z.array(schema),
		totalDocs: z.number(),
		limit: z.number(),
		totalPages: z.number(),
		page: z.number(),
		pagingCounter: z.number(),
		hasPrevPage: z.boolean(),
		hasNextPage: z.boolean(),
		prevPage: z.number().nullable(),
		nextPage: z.number().nullable(),
	});

	return payloadSchema.parse(body);
}

export async function load({ fetch }) {
	const quoteResponse = await fetch(`${PUBLIC_CMS_API_URL}/quotes?pagination=false`);
	const quotes = await payloadResponse(quoteResponse, quoteSchema);

	const postsResponse = await fetch(`${PUBLIC_CMS_API_URL}/posts?pagination=false`);
	const posts = await payloadResponse(postsResponse, postSchema);

	return {
		quotes: quotes.docs,
		posts: posts.docs,
	};
}
