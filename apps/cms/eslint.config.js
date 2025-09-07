import antfu from "@antfu/eslint-config";

export default antfu({
	stylistic: false,
	react: true,
	nextjs: true,
	rules: {
		"import/order": "off",
		"perfectionist/sort-imports": [
			"error",
			{
				newlinesBetween: "never",
				groups: [
					"side-effect",
					"side-effect-style",
					"builtin",
					"external",
					["internal", "internal-type"],
					["parent", "parent-type"],
					["sibling", "sibling-type"],
					["index", "index-type"],
					"object",
					"unknown",
				],
			},
		],
	},
	ignores: ["app/payload-types.ts", "app/admin/importMap.js"],
});
