import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { payloadResponse, quoteSchema } from "$lib/schema";

export async function load({ fetch }) {
	const quoteResponse = await fetch(`${PUBLIC_CMS_API_URL}/quotes?pagination=false`);
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
