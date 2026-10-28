<script lang="ts">
	import { untrack } from "svelte";

	import PostDate from "#lib/components/PostDate.svelte";
	import { createPost, updatePost } from "#lib/posts.remote.js";
	import type { Post } from "#lib/server/db/schema.js";

	import Editor from "../Editor.svelte";
	import FormLayout from "../FormLayout.svelte";
	import Switch from "../Switch.svelte";
	import { UnsavedChanges } from "../unsaved.svelte";

	interface Props {
		form: typeof createPost | typeof updatePost;
		post?: Post & { version?: number; pending?: boolean };
		ondelete?: () => Promise<void>;
	}

	const { form, post, ondelete }: Props = $props();

	const categories = [
		{ label: "Dialogue", value: "dialogue" },
		{ label: "Poetry", value: "poetry" },
		{ label: "Prose Poetry", value: "prose poetry" },
		{ label: "Short Story", value: "short story" },
	];

	let content = $state("");
	const issues = $derived(form.fields.allIssues());

	const unsaved = new UnsavedChanges(
		() => ({
			title: form.fields.title.value() ?? "",
			excerpt: form.fields.excerpt.value() ?? "",
			category: form.fields.category.value() ?? "",
			explicit: form.fields.explicit.value() ?? false,
			content,
		}),
		() => form.pending > 0,
	);

	$effect(() => {
		if (!post) {
			form.fields.set({});
			untrack(() => unsaved.commit());
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

		untrack(() => unsaved.commit());
	});

	function onTitleKeydown(event: KeyboardEvent) {
		// Titles are one line; Enter moves on instead of breaking it
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("excerpt")?.focus();
		}
	}
</script>

<FormLayout
	{...form}
	noun="post"
	section={{ href: "/admin/writing", label: "Writing" }}
	heading={form.fields.title.value()}
	view={post && `/writing/${post.slug}`}
	{issues}
	status={post?.status}
	version={post?.version}
	unpublished={post?.pending}
	dirty={unsaved.dirty}
	busy={form.pending > 0}
	result={form === updatePost ? updatePost.result : undefined}
	intentField={form.fields.intent}
	{ondelete}
>
	<header>
		<div class="flex flex-wrap items-baseline gap-x-3 text-sm">
			{#if post?.publishedAt}
				<PostDate date={post.publishedAt} />
			{:else}
				<span class="font-medium text-muted-foreground">Not yet published</span>
			{/if}

			{#if post?.revisedAt}
				<span class="text-muted-foreground">
					Revised <PostDate date={post.revisedAt} listing />
				</span>
			{/if}
		</div>

		<label class="sr-only" for="title">Title</label>
		<textarea
			id="title"
			class="field-bare mt-3 field-sizing-content resize-none py-1 text-fluid-xl/tight font-semibold text-pretty"
			placeholder="Untitled"
			rows="1"
			onkeydown={onTitleKeydown}
			{...form.fields.title.as("text")}></textarea>
	</header>

	<dl class="mt-8 divide-y divide-border border-y border-border">
		<div class="grid gap-x-6 gap-y-1 py-2 sm:grid-cols-[7rem_1fr] sm:items-center">
			<dt>
				<label class="mb-0 text-muted-foreground" for="category">Category</label>
			</dt>

			<dd>
				<select
					id="category"
					class="field-bare w-auto! has-[option:disabled:checked]:text-muted-foreground"
					{...form.fields.category.as("select")}
					value={form.fields.category.value() ?? ""}
				>
					<option value="" disabled selected>Choose a category</option>

					{#each categories as cat (cat.value)}
						<option value={cat.value} selected={post?.category === cat.value}>
							{cat.label}
						</option>
					{/each}
				</select>
			</dd>
		</div>

		<div class="grid gap-x-6 gap-y-1 py-2 sm:grid-cols-[7rem_1fr] sm:items-start">
			<dt class="sm:pt-2">
				<label class="mb-0 text-muted-foreground" for="excerpt">Excerpt</label>
			</dt>

			<dd>
				<textarea
					id="excerpt"
					class="field-bare field-sizing-content resize-none"
					placeholder="A line or two shown under the title in the index"
					rows="1"
					{...form.fields.excerpt.as("text")}></textarea>
			</dd>
		</div>

		<div class="grid gap-x-6 gap-y-2 py-3 sm:grid-cols-[7rem_1fr] sm:items-center">
			<dt class="text-[0.8125rem] font-medium text-muted-foreground">Options</dt>

			<dd class="flex flex-wrap items-center gap-x-6 gap-y-3">
				<Switch label="Explicit" {...form.fields.explicit.as("checkbox")} />

				{#if post?.status === "published" && form === updatePost}
					<span class="inline-flex items-center gap-2">
						<Switch
							label="Mark as revised"
							{...updatePost.fields.revision.as("checkbox")}
						/>
						<span class="text-xs text-muted-foreground max-sm:hidden">
							on next publish
						</span>
					</span>
				{/if}
			</dd>
		</div>
	</dl>

	<div class="mt-10">
		<input {...form.fields.content.as("hidden", content)} />
		<Editor category={form.fields.category.value()} bind:content />
	</div>
</FormLayout>
