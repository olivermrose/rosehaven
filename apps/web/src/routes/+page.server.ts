import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { quoteSchema, postSchema } from "$lib/schema";
import { z } from "zod";

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
