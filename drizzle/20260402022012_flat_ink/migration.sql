CREATE TYPE "category" AS ENUM('dialogue', 'poetry', 'prose-poetry', 'short-story');--> statement-breakpoint
CREATE TYPE "status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY,
	"category" "category" NOT NULL,
	"title" text NOT NULL UNIQUE,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"explicit" boolean DEFAULT false NOT NULL,
	"content_html" text NOT NULL,
	"commentary" text,
	"status" "status" DEFAULT 'draft'::"status" NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY,
	"text" text NOT NULL,
	"quotee" text NOT NULL,
	"source_title" text NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
