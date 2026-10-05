import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	lint: {
		jsPlugins: [
			{
				name: "vite-plus",
				specifier: "vite-plus/oxlint-plugin",
			},
		],
		rules: {
			"vite-plus/prefer-vite-plus-imports": "error",
		},
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
	fmt: {
		tabWidth: 4,
		useTabs: true,
		svelte: true,
		sortTailwindcss: {
			stylesheet: "./src/app.css",
		},
		sortImports: {
			internalPattern: ["$"],
			newlinesBetween: false,
		},
		ignorePatterns: ["drizzle/**/*.json", "src/assets/**"],
		overrides: [
			{
				files: ["*.yml", "*.yaml"],
				options: {
					tabWidth: 2,
				},
			},
		],
	},
	plugins: lazyPlugins(() => [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: {
				experimental: {
					async: true,
				},
			},
			adapter: adapter(),
			experimental: {
				remoteFunctions: true,
			},
		}),
	]),
	css: {
		lightningcss: {
			exclude: 2048 /* OklabColors */ | 1048576 /* LightDark */,
		},
	},
});
