<script lang="ts">
	import dayjs from "dayjs";

	import Content from "#lib/components/Content.svelte";
	import PageNav from "#lib/components/PageNav.svelte";
	import PostDate from "#lib/components/PostDate.svelte";
	import PostTitle from "#lib/components/PostTitle.svelte";
	import type { Post } from "#lib/server/db/schema.js";

	const { data } = $props();
</script>

<div class="mx-auto max-w-4xl px-6 pt-28 pb-20">
	<PageNav back="/writing#{data.post.category}" edit="/admin/writing/{data.post.id}" />

	<article>
		<header class="mb-8">
			<PostDate date={data.post.publishedAt} />

			{#if data.post.revisedAt}
				<div class="text-sm text-muted-foreground">
					Revised

					<time datetime={data.post.revisedAt.toISOString()}>
						{dayjs(data.post.revisedAt).format("MMMM D, YYYY")}
					</time>
				</div>
			{/if}

			<PostTitle class="text-fluid-xl">
				{data.post.title}
			</PostTitle>
		</header>

		<Content post={data.post} />
	</article>

	{#if data.prev || data.next}
		<hr class="my-10 h-px w-full border-0 bg-muted-foreground" />

		<nav class="flex items-center justify-between" aria-label="Post navigation">
			{@render navigation("Previous", data.prev)}
			{@render navigation("Next", data.next)}
		</nav>
	{/if}
</div>

{#snippet navigation(type: "Previous" | "Next", post?: Pick<Post, "slug" | "title">)}
	{#if post}
		<div
			class={[
				"group flex max-w-1/2 flex-col",
				type === "Previous" ? "items-start" : "ml-auto items-end",
			]}
		>
			<span class="text-sm uppercase">
				&lbrace; {type} &rbrace;
			</span>

			<a class="mt-2 line-clamp-1 text-fluid-lg/tight font-light" href="/writing/{post.slug}">
				<span
					class="transition-colors duration-300 group-hover:text-plum-500 dark:group-hover:text-white"
				>
					{post.title}
				</span>
			</a>
		</div>
	{/if}
{/snippet}
