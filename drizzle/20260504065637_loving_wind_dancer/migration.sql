ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
UPDATE "posts" SET "category" = REPLACE("category", '-', ' ');--> statement-breakpoint
DROP TYPE "category";--> statement-breakpoint
CREATE TYPE "category" AS ENUM('dialogue', 'poetry', 'prose poetry', 'short story');--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "category" SET DATA TYPE "category" USING "category"::"category";
