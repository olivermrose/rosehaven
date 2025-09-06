import { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const posts: CollectionConfig<"posts"> = {
	slug: "posts",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "slug", "category", "excerpt", "publishedAt"],
	},
	fields: [
		{
			name: "category",
			type: "select",
			options: [
				{ label: "Dialogue", value: "dialogue" },
				{ label: "Poetry", value: "poetry" },
				{ label: "Prose Poetry", value: "prose-poetry" },
				{ label: "Short Story", value: "short-story" },
			],
			required: true,
		},
		{
			name: "title",
			type: "text",
			required: true,
			unique: true,
		},
		{
			name: "excerpt",
			type: "text",
			required: false,
		},
		{
			name: "explicit",
			type: "checkbox",
			required: false,
			defaultValue: false,
		},
		{
			name: "content",
			type: "richText",
			required: true,
		},
		...slugField("title"),
		{
			name: "publishedAt",
			type: "date",
			admin: {
				date: {
					pickerAppearance: "dayOnly",
				},
				position: "sidebar",
			},
			hooks: {
				beforeChange: [
					({ siblingData, value }) => {
						if (siblingData._status === "published" && !value) {
							return new Date();
						}

						return value;
					},
				],
			},
		},
	],
};
