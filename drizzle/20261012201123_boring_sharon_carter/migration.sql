CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"year" integer,
	"slug" text NOT NULL UNIQUE,
	"artwork" text NOT NULL,
	"tracklist" jsonb DEFAULT '[]' NOT NULL,
	"content" text NOT NULL,
	"status" "status" DEFAULT 'draft'::"status" NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
