import { env } from "$env/dynamic/public";
import { payloadResponse, quoteSchema } from "$lib/schema";

export async function load({ fetch }) {
	const quoteResponse = await fetch(`${env.PUBLIC_CMS_API_URL}/quotes?pagination=false`);
	const quotes = await payloadResponse(quoteResponse, quoteSchema);

	return {
		quotes: quotes.docs,
		seo: {
			path: "/",
			title: null,
			description:
				'As I drift off into reverie, I find myself running through a thousand different scenarios of "What if?" My life is not bound by the earth I stand upon.',
		},
	};
}
