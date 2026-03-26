import {
	boolean,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
	"dialogue",
	"poetry",
	"prose-poetry",
	"short-story",
]);

export const statusEnum = pgEnum("status", ["draft", "published"]);

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	category: categoryEnum("category").notNull(),
	title: text("title").notNull().unique(),
	slug: text("slug").notNull(),
	excerpt: text("excerpt").notNull(),
	explicit: boolean("explicit").notNull().default(false),
	contentHtml: text("content_html").notNull(),
	commentary: text("commentary"),
	status: statusEnum("status").notNull().default("draft"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
	id: serial("id").primaryKey(),
	text: text("text").notNull(),
	quotee: text("quotee").notNull(),
	sourceTitle: text("source_title").notNull(),
	sourceUrl: text("source_url"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
