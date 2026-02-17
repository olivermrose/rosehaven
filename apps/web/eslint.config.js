import antfu from "@antfu/eslint-config";

export default antfu({
	stylistic: false,
	svelte: true,
	rules: {
		"no-console": "off",
		"no-unused-vars": "warn",
		"import/order": "off",
		"perfectionist/sort-imports": [
			"error",
			{
				newlinesBetween: 0,
				groups: [
					"side-effect",
					"side-effect-style",
					"builtin",
					"external",
					"icons",
					"sveltekit",
					"internal",
					"type-internal",
					"parent",
					"type-parent",
					"sibling",
					"type-sibling",
					"index",
					"type-index",
					"unknown",
				],
				customGroups: [
					{
						groupName: "icons",
						elementNamePattern: ["^~icons/.+"],
					},
					{
						groupName: "sveltekit",
						elementNamePattern: ["\\$app/.+", "\\$env/.+", "\\$lib/.+"],
					},
				],
			},
		],
		"unused-imports/no-unused-imports": "warn",
		"unused-imports/no-unused-vars": "off",
		"svelte/no-at-html-tags": "off",
	},
});
