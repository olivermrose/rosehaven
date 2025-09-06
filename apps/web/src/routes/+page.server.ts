import { PUBLIC_CMS_API_URL } from "$env/static/public";
import { quoteSchema, payloadResponse } from "$lib/schema";

export async function load({ fetch }) {
	const quoteResponse = await fetch(`${PUBLIC_CMS_API_URL}/quotes?pagination=false`);
	const quotes = await payloadResponse(quoteResponse, quoteSchema);

	return {
		quotes: quotes.docs,
	};
}
