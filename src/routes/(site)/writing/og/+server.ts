import { ImageResponse } from "@takumi-rs/image-response/wasm";
import { dev } from "$app/environment";
import { template } from "./template";

export async function GET({ url }) {
	const title = url.searchParams.get("title") ?? "Untitled";
	const excerpt = url.searchParams.get("excerpt") ?? "";

	return new ImageResponse(template({ title, excerpt }), {
		width: 1200,
		height: 630,
		format: "webp",
		headers: {
			// 31536000 = 365 days
			"Cache-Control": dev
				? "no-cache, no-store"
				: "public, immutable, no-transform, max-age=31536000",
		},
	});
}
