<script lang="ts">
	import type { Snippet } from "svelte";
	import { createPost, updatePost } from "#lib/posts.remote.js";
	import type { Post } from "#lib/server/db/schema.js";
	import Editor from "../Editor.svelte";
	import FormLayout from "../FormLayout.svelte";

	interface Props {
		form: typeof createPost | typeof updatePost;
		post?: Post;
		actions?: Snippet;
	}

	const { form, post, actions }: Props = $props();

	const categories = [
		{ label: "Dialogue", value: "dialogue" },
		{ label: "Poetry", value: "poetry" },
		{ label: "Prose Poetry", value: "prose poetry" },
		{ label: "Short Story", value: "short story" },
	];

	let content = $state("");
	const issues = $derived(form.fields.allIssues());

	$effect(() => {
		if (!post) {
			form.fields.set({});
			return;
		}

		content = post.content;

		form.fields.set({
			title: post.title,
			excerpt: post.excerpt,
			category: post.category,
			content: post.content,
			explicit: post.explicit,
		});
	});
</script>

<FormLayout {...form} {issues} status={post?.status} statusField={form.fields.status} {actions}>
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
		<input {...form.fields.content.as("hidden", content)} />
		<Editor category={form.fields.category.value()} bind:content />
	</div>

	{#snippet options()}
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

		{#if post?.status === "published" && form === updatePost}
			<label class="mb-0 flex cursor-pointer items-center gap-3">
				<div class="relative">
					<input class="peer sr-only" {...updatePost.fields.revision.as("checkbox")} />

					<div
						class="h-5 w-9 rounded-full border border-foreground/30 transition-colors peer-checked:border-foreground peer-checked:bg-foreground"
					></div>
					<div
						class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-foreground/40 transition-all peer-checked:left-4.5 peer-checked:bg-background"
					></div>
				</div>

				<span>Revision</span>
			</label>
		{/if}
	{/snippet}
</FormLayout>
