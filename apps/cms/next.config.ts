import withPayload from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/admin",
				permanent: true,
			},
		];
	},
};

export default withPayload(nextConfig);
