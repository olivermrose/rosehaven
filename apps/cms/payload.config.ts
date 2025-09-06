import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import { quotes } from "@collections/quotes";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { posts } from "@collections/posts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname, "src"),
			importMapFile: path.resolve(dirname, "app", "admin", "importMap.js"),
		},
	},
	collections: [posts, quotes],
	editor: lexicalEditor(),
	typescript: {
		outputFile: path.resolve(dirname, "app", "payload-types.ts"),
	},
	secret: process.env.PAYLOAD_SECRET ?? "",
	db: mongooseAdapter({ url: process.env.DATABASE_URL ?? "" }),
	sharp,
});
