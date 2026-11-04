import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
	"dialogue",
	"poetry",
	"prose poetry",
	"short story",
]);

export const statusEnum = pgEnum("status", ["draft", "published"]);

export const posts = pgTable("posts", {
	id: serial().primaryKey(),
	category: categoryEnum().notNull(),
	title: text().notNull().unique(),
	slug: text().notNull(),
	excerpt: text().notNull(),
	explicit: boolean().notNull().default(false),
	content: text().notNull(),
	status: statusEnum().notNull().default("draft"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	revisedAt: timestamp("revised_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export interface Track {
	title: string;
	duration?: string;
}

export const reviews = pgTable("reviews", {
	id: serial().primaryKey(),
	title: text().notNull(),
	artist: text().notNull(),
	year: integer(),
	slug: text().notNull().unique(),
	artwork: text().notNull(),
	tracklist: jsonb().$type<Track[]>().notNull().default([]),
	content: text().notNull(),
	status: statusEnum().notNull().default("draft"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export const quotes = pgTable("quotes", {
	id: serial().primaryKey(),
	text: text().notNull(),
	quotee: text().notNull(),
	sourceTitle: text("source_title").notNull(),
	sourceUrl: text("source_url"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export const versions = pgTable(
	"versions",
	{
		id: serial().primaryKey(),
		entityType: text("entity_type").notNull(),
		entityId: integer("entity_id").notNull(),
		version: integer().notNull(),
		content: text().notNull(),
		metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
		publishedAt: timestamp("published_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [unique().on(t.entityType, t.entityId, t.version)],
);

export type Version = typeof versions.$inferSelect;
export type NewVersion = typeof versions.$inferInsert;
