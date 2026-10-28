CREATE TABLE "versions" (
	"id" serial PRIMARY KEY,
	"entity_type" text NOT NULL,
	"entity_id" integer NOT NULL,
	"version" integer NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "versions_entity_type_entity_id_version_unique" UNIQUE("entity_type","entity_id","version")
);
--> statement-breakpoint
INSERT INTO "versions" ("entity_type", "entity_id", "version", "content", "metadata", "published_at", "created_at")
SELECT 'posts', "id", 1, "content", jsonb_build_object('title', "title", 'category', "category", 'excerpt', "excerpt", 'explicit', "explicit"), CASE WHEN "status" = 'published' THEN "updated_at" END, "updated_at"
FROM "posts";
--> statement-breakpoint
INSERT INTO "versions" ("entity_type", "entity_id", "version", "content", "metadata", "published_at", "created_at")
SELECT 'reviews', "id", 1, "content", jsonb_build_object('title', "title", 'artist', "artist", 'year', "year", 'artwork', "artwork", 'tracklist', "tracklist"), CASE WHEN "status" = 'published' THEN "updated_at" END, "updated_at"
FROM "reviews";
