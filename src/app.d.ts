import type { Hyperdrive } from "@cloudflare/workers-types";
import type { Drizzle } from "drizzle-orm/node-postgres";

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
			db: Drizzle;
		}

		interface PageData {
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

export {};
