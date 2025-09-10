import fs from "node:fs/promises";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		{
			enforce: "pre",
			name: "vite-plugin-glsl",
			transform(code, id) {
				if (/\.(?:vert|frag|glsl)$/.test(id)) {
					return { code: `export default ${JSON.stringify(code)}` };
				}
			},
		},
		{
			name: "vite-plugin-fonts",
			async transform(_, id) {
				if (id.endsWith(".woff")) {
					const buffer = await fs.readFile(id);

					return {
						code: `export default ${JSON.stringify(buffer)}`,
					};
				}
			},
		},
	],
});
