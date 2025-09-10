import { Buffer } from "node:buffer";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { SatoriOptions } from "satori";
import { html } from "satori-html";
import { render } from "svelte/server";
import { dev } from "$app/environment";
import Inter400 from "./InterDisplay-400.woff";
import Inter700 from "./InterDisplay-700.woff";
import Template from "./Template.svelte";

const satoriOptions: SatoriOptions = {
	width: 1200,
	height: 600,
	fonts: [
		{
			name: "Inter",
			data: Buffer.from(Inter400),
			weight: 400,
		},
		{
			name: "Inter",
			data: Buffer.from(Inter700),
			weight: 700,
		},
	],
};

export async function GET({ url }) {
	const title = url.searchParams.get("title") ?? "Untitled";
	const excerpt = url.searchParams.get("excerpt") ?? "";

	const rendered = render(Template, { props: { title, excerpt } });
	const element = html(rendered.body);

	// @ts-expect-error - type mismatch
	const svg = await satori(element, satoriOptions);

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: "width",
			value: 1200,
		},
		font: {
			loadSystemFonts: false,
		},
	});

	const png = resvg.render().asPng();

	return new Response(png.buffer as ArrayBuffer, {
		headers: {
			"Content-Type": "image/png",
			// 31536000 = 365 days
			"Cache-Control": dev
				? "no-cache, no-store"
				: "public, immutable, no-transform, max-age=31536000",
		},
	});
}
