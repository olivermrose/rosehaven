import { boolean, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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
	content: text("content").notNull(),
	commentary: text("commentary"),
	status: statusEnum("status").notNull().default("draft"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
