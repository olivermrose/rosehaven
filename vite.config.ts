import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	css: {
		lightningcss: {
			exclude: 2048 /* OklabColors */ | 1048576 /* LightDark */,
		},
	},
});
