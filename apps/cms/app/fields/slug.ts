import type { CheckboxField, TextField } from "payload";
import { slugify } from "@/app/util";

interface Overrides {
	slugOverrides?: Partial<TextField>;
	checkboxOverrides?: Partial<CheckboxField>;
}

export function slugField(field = "title", overrides: Overrides = {}) {
	const { slugOverrides, checkboxOverrides } = overrides;

	const checkBoxField: CheckboxField = {
		name: "slugLock",
		type: "checkbox",
		defaultValue: true,
		admin: {
			hidden: true,
			position: "sidebar",
		},
		...checkboxOverrides,
	};

	// @ts-expect-error - mismatch Partial<TextField> with TextField
	const slugField: TextField = {
		name: "slug",
		type: "text",
		index: true,
		label: "Slug",
		...(slugOverrides || {}),
		hooks: {
			beforeValidate: [
				({ data, operation, value }) => {
					if (typeof value === "string") {
						return slugify(value);
					}

					if (operation === "create" || !data?.slug) {
						const fallback = data?.[field];

						if (typeof fallback === "string") {
							return slugify(fallback);
						}
					}

					return value;
				},
			],
		},
		admin: {
			position: "sidebar",
			...(slugOverrides?.admin || {}),
			components: {
				Field: {
					path: "@/app/components/fields/Slug#Slug",
					clientProps: {
						fieldToUse: field,
						checkboxFieldPath: checkBoxField.name,
					},
				},
			},
		},
	};

	return [slugField, checkBoxField];
}
