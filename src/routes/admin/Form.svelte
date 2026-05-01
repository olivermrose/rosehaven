<script lang="ts">
	import type { Snippet } from "svelte";
	import { createPost, updatePost } from "$lib/posts.remote";
	import type { Post } from "$lib/server/db/schema";
	import Editor from "./Editor.svelte";

	interface Props {
		form: typeof createPost | typeof updatePost;
		post?: Post;
		actions?: Snippet;
	}

	const { form, post, actions }: Props = $props();

	const categories = [
		{ label: "Dialogue", value: "dialogue" },
		{ label: "Poetry", value: "poetry" },
		{ label: "Prose Poetry", value: "prose-poetry" },
		{ label: "Short Story", value: "short-story" },
	];

	let content = $state("");
	const issues = $derived(form.fields.allIssues());

	$effect(() => {
		if (!post) return;

		content = post.content;

		form.fields.set({
			title: post.title,
			excerpt: post.excerpt,
			category: post.category,
			content: post.content,
			commentary: post.commentary ?? undefined,
			explicit: post.explicit,
		});
	});
</script>

<form class="flex items-start gap-8" {...form}>
	<div class="min-w-0 flex-1 space-y-8">
		{#if issues}
			<div class="border-l-2 border-peach-400 bg-peach-400/5 px-5 py-3">
				<p class="mb-2 text-peach-600 dark:text-peach-300">Error</p>

				<ul class="space-y-1">
					{#each issues as issue}
						<li class="text-sm text-peach-700 dark:text-peach-200">{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div>
			<label for="title">Title</label>
			<input id="title" placeholder="Post title" {...form.fields.title.as("text")} />
		</div>

		<div class="grid gap-8 sm:grid-cols-2">
			<div>
				<label for="excerpt">Excerpt</label>
				<input id="excerpt" placeholder="Brief preview" {...form.fields.excerpt.as("text")} />
			</div>

			<div>
				<label for="category">Category</label>

				<select
					id="category"
					class="has-[option:disabled:checked]:text-muted-foreground"
					{...form.fields.category.as("select")}
				>
					<option value="" disabled selected>Select category</option>

					{#each categories as cat}
						<option value={cat.value} selected={post?.category === cat.value}>
							{cat.label}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<input name="content" type="hidden" value={content} />
			<Editor category={form.fields.category.value()} bind:content />
		</div>

		<div>
			<label class="flex items-center" for="commentary">
				Commentary <span class="ml-1.5 text-muted-foreground normal-case">(optional)</span>
			</label>

			<textarea
				id="commentary"
				class="resize-y"
				placeholder="Additional thoughts"
				rows="3"
				{...form.fields.commentary.as("text")}
			></textarea>
		</div>
	</div>

	<aside
		class="sticky top-24 w-64 shrink-0 space-y-6 divide-y divide-border rounded-2xl border border-border p-6 *:not-last:pb-6"
	>
		<div>
			<span class="mb-2 block">Status</span>

			<div
				class={[
					"inline-block rounded-full px-2 py-1 text-xs uppercase",
					post?.status === "published"
						? "bg-aloe-500/40 text-aloe-700 dark:text-aloe-300"
						: "bg-denim-500/40 text-denim-700 dark:text-denim-300",
				]}
			>
				{post?.status ?? "draft"}
			</div>
		</div>

		<div>
			<label class="mb-0 flex cursor-pointer items-center gap-3">
				<div class="relative">
					<input class="peer sr-only" {...form.fields.explicit.as("checkbox")} />

					<div
						class="h-5 w-9 rounded-full border border-foreground/30 transition-colors peer-checked:border-foreground peer-checked:bg-foreground"
					></div>
					<div
						class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-foreground/40 transition-all peer-checked:left-4.5 peer-checked:bg-background"
					></div>
				</div>

				<span>Explicit</span>
			</label>
		</div>

		<div class="space-y-2">
			<button class="w-full" data-variant="secondary" {...form.fields.status.as("submit", "draft")}>
				Save Draft
			</button>

			<button
				class="w-full"
				data-variant="primary"
				{...form.fields.status.as("submit", "published")}
			>
				{post?.status === "published" ? "Update" : "Publish"}
			</button>
		</div>

		{#if actions}
			<div>
				{@render actions()}
			</div>
		{/if}
	</aside>
</form>
