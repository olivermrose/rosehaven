import { z } from "zod";

const metadata = z.object({
	id: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const quoteSchema = metadata.extend({
	text: z.string(),
	quotee: z.string(),
	sourceTitle: z.string(),
	sourceUrl: z.string().optional(),
});

export type Quote = z.infer<typeof quoteSchema>;

export const postSchema = metadata.extend({
	publishedAt: z.iso.datetime().optional(),
	category: z.enum(["dialogue", "poetry", "prose-poetry", "short-story"]),
	slug: z.string(),
	title: z.string(),
	excerpt: z.string(),
	explicit: z.boolean(),
	contentHtml: z.string(),
});

export type Post = z.infer<typeof postSchema>;

export async function payloadResponse<T extends z.ZodObject>(response: Response, schema: T) {
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
