// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

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
		// interface Locals {}
		interface PageData {
			seo: Seo;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
