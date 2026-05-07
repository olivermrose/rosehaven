import type { Component } from "svelte";
import type { Post } from "$lib/server/db/schema";

type PostComponent = Component<{ post: Post }>;

const modules = import.meta.glob<{ default: PostComponent }>(
	"/src/routes/admin/components/*.svelte",
	{ eager: true },
);

export const postComponents: Record<string, PostComponent> = {};

for (const [path, mod] of Object.entries(modules)) {
	const name = path
		.split("/")
		.pop()
		?.replace(/\.svelte$/, "");

	if (name) postComponents[name] = mod.default;
}

export const postComponentNames = Object.keys(postComponents).toSorted();
