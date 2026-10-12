CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY,
	"text" text NOT NULL,
	"quotee" text NOT NULL,
	"source_title" text NOT NULL,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
