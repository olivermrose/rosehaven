import { BASE_URL } from "$lib";
import type { ReactNode } from "react";

const colors = [
	"#9e3340", // wine
	"#8daa5a", // aloe
	"#e49367", // peach
	"#5c86b2", // denim
	"#9b4672", // plum
];

function $(type: string, props: Record<string, unknown>, ...children: unknown[]): ReactNode {
	return {
		type,
		key: null,
		props: {
			...props,
			children: children.length === 1 ? children[0] : children,
		},
	};
}

export function template({ title, excerpt }: { title: string; excerpt: string }): ReactNode {
	return $(
		"div",
		{ tw: "flex h-full w-full flex-col bg-white" },
		$(
			"div",
			{ tw: "flex grow flex-col justify-between p-10" },
			$(
				"div",
				{ tw: "-mt-2 flex items-center" },
				$("img", {
					tw: "h-14 w-14",
					style: { filter: "invert(1)" },
					src: `${BASE_URL}/favicon.svg`,
				}),
				$("h1", { tw: "ml-5 text-4xl font-normal" }, "oliver rose."),
			),
			$(
				"div",
				{ tw: "flex w-full flex-col" },
				$("h2", { tw: "flex text-8xl font-bold" }, title),
				$(
					"p",
					{
						style: { maxWidth: "75%" },
						tw: "flex text-4xl font-normal leading-normal text-neutral-600",
					},
					excerpt,
				),
			),
		),
		$(
			"div",
			{ tw: "flex h-4 w-full" },
			...colors.map((color) =>
				$("div", {
					tw: "flex h-full grow",
					style: { background: color },
				}),
			),
		),
	);
}
