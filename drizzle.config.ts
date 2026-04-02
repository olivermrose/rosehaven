import { defineConfig } from "drizzle-kit";

console.log(process.env.DATABASE_URL);

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/lib/server/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		// @ts-expect-error - types
		// eslint-disable-next-line node/prefer-global/process
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
});
