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
	],
});
