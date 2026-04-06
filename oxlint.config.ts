import { defineConfig } from "oxlint";

export default defineConfig({
	categories: {
		correctness: "error",
		nursery: "allow",
		pedantic: "warn",
		perf: "warn",
		restriction: "allow",
		style: "allow",
		suspicious: "warn",
	},
	rules: {
		"no-inline-comments": "off",
		"unicorn/filename-case": ["error", { ignore: "\\.svelte$" }],
	},
});
