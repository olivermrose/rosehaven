import type { Hyperdrive } from "@cloudflare/workers-types";
import type { drizzle } from "drizzle-orm/node-postgres";

interface Seo {
	path: string;
	title: string | null;
	description: string;
	image?: string;
	article?: boolean;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: ReturnType<typeof drizzle>;
		}

		interface PageData {
			authenticated?: boolean;
			seo: Seo;
		}
		// interface PageState {}
		interface Platform {
			env: {
				HYPERDRIVE: Hyperdrive;
			};
		}
	}
}

// oxlint-disable-next-line unicorn/require-module-specifiers
export {};
