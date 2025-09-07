<script lang="ts">
	import dayjs from "dayjs";
	import type { Post } from "$lib/schema";

	const { data } = $props();

	const content = $derived.by(() => {
		// Lexical adds leading/trailing whitespace within <a /> (and probably
		// other inline elements).
		// eslint-disable-next-line regexp/no-super-linear-backtracking
		return data.post.contentHtml.replace(/(<a[^>]*>)\s*(.*?)\s*(<\/a>)/g, "$1$2$3");
	});
</script>

<article
	class="prose dark:prose-invert prose-neutral mx-auto max-w-4xl overflow-auto px-4 pb-20 pt-28 sm:px-6"
>
	<header>
		<div class="flex items-center justify-between text-sm">
			<time
				class="text-denim-500 font-medium dark:text-neutral-500"
				datetime={data.post.publishedAt}
			>
				{dayjs(data.post.publishedAt).format("MMMM D, YYYY")}
			</time>

			<a class="group no-underline" href="/#{data.post.category}">
				<span class="inline-block duration-300 group-hover:-translate-x-1">&lt;--</span> Back
			</a>
		</div>

		<h1 class="text-fluid-4xl mb-8 mt-1 font-semibold">
			{data.post.title}
		</h1>
	</header>

	<div data-content data-category={data.post.category}>
		{@html content}
	</div>

	{#if data.prev || data.next}
		<div class="bg-foreground/50 my-10 h-px w-full" role="separator"></div>

		<footer class="flex flex-col">
			<nav class="flex items-center justify-between">
				{@render navigation("Previous", data.prev)}
				{@render navigation("Next", data.next)}
			</nav>
		</footer>
	{/if}
</article>

{#snippet navigation(type: "Next" | "Previous", post?: Post)}
	{#if post}
		<div class={["group flex flex-col", type === "Previous" ? "items-start" : "ml-auto items-end"]}>
			<span class="text-sm uppercase">
				&lbrace; {type} &rbrace;
			</span>

			<a class="text-fluid-2xl/[1.25] not-prose mt-2 font-light" href="/writing/{post.slug}">
				<span
					class="group-hover:text-plum-500 transition-colors duration-300 dark:group-hover:text-white"
				>
					{post.title}
				</span>
			</a>
		</div>
	{/if}
{/snippet}
