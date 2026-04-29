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
		{ label: "Select category", value: "" },
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

<form class="flex items-start gap-12" {...form}>
	<div class="min-w-0 flex-1 space-y-8">
		{#if issues}
			<div class="rounded-lg border border-nd-accent/30 bg-nd-accent/5 px-5 py-3">
				<p class="nd-label mb-2 text-nd-accent">[ERROR]</p>

				<ul class="space-y-1">
					{#each issues as issue}
						<li class="font-nd-sans text-xs text-nd-accent">{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div>
			<label for="title" class="nd-label mb-3 block">Title</label>

			<input
				id="title"
				class="nd-input"
				placeholder="Post title"
				{...form.fields.title.as("text")}
			/>
		</div>

		<div class="grid gap-8 sm:grid-cols-2">
			<div>
				<label for="excerpt" class="nd-label mb-3 block">Excerpt</label>

				<input
					id="excerpt"
					class="nd-input"
					placeholder="Brief preview"
					{...form.fields.excerpt.as("text")}
				/>
			</div>

			<div>
				<label for="category" class="nd-label mb-3 block">Category</label>

				<select id="category" class="nd-select" {...form.fields.category.as("select")}>
					{#each categories as cat}
						<option value={cat.value} selected={post?.category === cat.value}>
							{cat.label}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="nd-label mb-3 block">Content</label>
			<input name="content" type="hidden" value={content} />

			<Editor dialogue={form.fields.category.value() === "dialogue"} bind:content />
		</div>

		<div>
			<label for="commentary" class="nd-label mb-3 block">
				Commentary
				<span class="text-nd-dim">(optional)</span>
			</label>

			<textarea
				id="commentary"
				class="nd-input min-h-20 resize-y"
				placeholder="Additional thoughts"
				{...form.fields.commentary.as("text")}
			></textarea>
		</div>
	</div>

	<aside class="w-64 shrink-0">
		<div class="sticky top-12 space-y-6 rounded-xl border border-nd-edge bg-nd-surface p-6">
			<div>
				<p class="nd-label mb-3">Status</p>

				<span
					class={[
						"inline-block rounded-full border px-3 py-0.5 font-nd-mono text-xs tracking-[0.06em] uppercase",
						post?.status === "published"
							? "border-nd-success/40 text-nd-success"
							: "border-nd-warning/40 text-nd-warning",
					]}
				>
					{post?.status ?? "draft"}
				</span>
			</div>

			<div class="border-t border-nd-edge pt-6">
				<label class="flex cursor-pointer items-center gap-3">
					<div class="relative">
						<input class="peer sr-only" {...form.fields.explicit.as("checkbox")} />

						<div
							class="h-5 w-9 rounded-full border border-nd-edge-strong transition-colors peer-checked:border-nd-solid peer-checked:bg-nd-solid"
						></div>
						<div
							class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-nd-dim transition-all peer-checked:left-4.5 peer-checked:bg-nd-black"
						></div>
					</div>

					<span class="nd-label">Explicit</span>
				</label>
			</div>

			<div class="space-y-3 border-t border-nd-edge pt-6">
				<button
					class="nd-btn nd-btn-secondary w-full"
					{...form.fields.status.as("submit", "draft")}
				>
					Save draft
				</button>

				<button
					class="nd-btn nd-btn-primary w-full"
					{...form.fields.status.as("submit", "published")}
				>
					{post?.status === "published" ? "Update" : "Publish"}
				</button>
			</div>

			{#if actions}
				<div class="border-t border-nd-edge pt-6">
					{@render actions()}
				</div>
			{/if}
		</div>
	</aside>
</form>
