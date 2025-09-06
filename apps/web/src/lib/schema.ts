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
	excerpt: z.string().optional(),
	explicit: z.boolean(),
	contentHtml: z.string(),
});

export type Post = z.infer<typeof postSchema>;
