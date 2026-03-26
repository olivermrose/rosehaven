<script lang="ts">
	import type { Post } from "$lib/server/db/schema";
	import Editor from "./Editor.svelte";

	interface Props {
		post?: Post;
		action?: string;
		error?: string;
	}

	const { post, action, error }: Props = $props();

	let content = $derived(post?.contentHtml ?? "");

	const categories = [
		{ label: "Dialogue", value: "dialogue" },
		{ label: "Poetry", value: "poetry" },
		{ label: "Prose Poetry", value: "prose-poetry" },
		{ label: "Short Story", value: "short-story" },
	] as const;

	const inputClass =
		"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
</script>

<form method="POST" {action} class="space-y-5">
	{#if error}
		<div class="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
	{/if}

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="title" class="mb-1.5 block text-sm font-medium">Title</label>
			<input id="title" name="title" required value={post?.title ?? ""} class={inputClass} />
		</div>

		<div>
			<label for="category" class="mb-1.5 block text-sm font-medium">Category</label>
			<select id="category" name="category" required class={inputClass}>
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
		<input id="excerpt" name="excerpt" required value={post?.excerpt ?? ""} class={inputClass} />
	</div>

	<div>
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="mb-1.5 block text-sm font-medium">Content</label>
		<Editor {content} onupdate={(html) => (content = html)} />
		<input type="hidden" name="contentHtml" value={content} />
	</div>

	<div>
		<label for="commentary" class="mb-1.5 block text-sm font-medium">
			Commentary
			<span class="font-normal text-neutral-400">(optional)</span>
		</label>
		<textarea
			id="commentary"
			name="commentary"
			rows="3"
			class={inputClass}
			value={post?.commentary ?? ""}
		></textarea>
	</div>

	<div class="flex items-center gap-6">
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" name="explicit" checked={post?.explicit ?? false} class="rounded" />
			Explicit
		</label>
	</div>

	<div class="flex items-center gap-3 border-t border-neutral-200 pt-5">
		<button
			type="submit"
			name="status"
			value="draft"
			class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
		>
			Save as draft
		</button>

		<button
			type="submit"
			name="status"
			value="published"
			class="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
		>
			{post?.status === "published" ? "Update" : "Publish"}
		</button>
	</div>
</form>
