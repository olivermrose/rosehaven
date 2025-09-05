import { CollectionConfig } from "payload";

export const quotes: CollectionConfig<"quotes"> = {
	slug: "quotes",
	fields: [
		{
			name: "text",
			type: "textarea",
			required: true,
		},
		{
			name: "quotee",
			type: "text",
			required: true,
		},
		{
			name: "sourceTitle",
			type: "text",
			required: true,
		},
		{
			name: "sourceUrl",
			type: "text",
			required: false,
		},
	],
};
