<script lang="ts">
	import { onMount } from "svelte";
	import { createPost, updatePost } from "$lib/posts.remote";
	import type { Post } from "$lib/server/db/schema";
	import Editor from "./Editor.svelte";

	interface Props {
		form: typeof createPost | typeof updatePost;
		post?: Post;
	}

	const { form, post }: Props = $props();

	onMount(() => {
		if (!post) return;

		form.fields.set({
			title: post.title,
			excerpt: post.excerpt,
			category: post.category,
			content: post.content,
			commentary: post.commentary ?? undefined,
			explicit: post.explicit,
		});
	});

	let content = $derived(post?.content ?? "");
	const issues = $derived(form.fields.allIssues());

	const categories = [
		{ label: "Dialogue", value: "dialogue" },
		{ label: "Poetry", value: "poetry" },
		{ label: "Prose Poetry", value: "prose-poetry" },
		{ label: "Short Story", value: "short-story" },
	] as const;

	const inputClass =
		"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
</script>

<form class="space-y-5" {...form}>
	{#if issues}
		<div class="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
			<ul>
				{#each issues as issue}
					<li>{issue.message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="title" class="mb-1.5 block text-sm font-medium">Title</label>
			<input id="title" class={inputClass} {...form.fields.title.as("text")} />
		</div>

		<div>
			<label for="category" class="mb-1.5 block text-sm font-medium">Category</label>

			<select id="category" class={inputClass} {...form.fields.category.as("select")}>
				{#each categories as cat}
					<option value={cat.value} selected={post?.category === cat.value}>
						{cat.label}
					</option>
				{/each}
			</select>
		</div>
	</div>

	<div>
		<label for="excerpt" class="mb-1.5 block text-sm font-medium">Excerpt</label>
		<input id="excerpt" class={inputClass} {...form.fields.excerpt.as("text")} />
	</div>

	<div>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="mb-1.5 block text-sm font-medium">Content</label>
		<input name="content" type="hidden" value={content} />

		<Editor {content} onupdate={(html) => (content = html)} />
	</div>

	<div>
		<label for="commentary" class="mb-1.5 block text-sm font-medium">
			Commentary
			<span class="font-normal text-neutral-400">(optional)</span>
		</label>
		<textarea id="commentary" class={inputClass} rows="3" {...form.fields.commentary.as("text")}
		></textarea>
	</div>

	<div class="flex items-center gap-6">
		<label class="flex items-center gap-2 text-sm">
			<input class="rounded" {...form.fields.explicit.as("checkbox")} />
			Explicit
		</label>
	</div>

	<div class="flex items-center gap-3 border-t border-neutral-200 pt-5">
		<button
			class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
			{...form.fields.status.as("submit", "draft")}
		>
			Save as draft
		</button>

		<button
			class="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
			{...form.fields.status.as("submit", "published")}
		>
			{post?.status === "published" ? "Update" : "Publish"}
		</button>
	</div>
</form>
