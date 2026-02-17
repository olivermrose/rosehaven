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
	class="mx-auto prose max-w-4xl overflow-auto px-4 pt-28 pb-20 prose-neutral sm:px-6 dark:prose-invert"
>
	<header>
		<div class="flex items-center justify-between text-sm">
			<time
				class="font-medium text-denim-500 dark:text-neutral-500"
				datetime={data.post.publishedAt}
			>
				{dayjs(data.post.publishedAt).format("MMMM D, YYYY")}
			</time>

			<a class="group no-underline" href="/#{data.post.category}">
				<span class="inline-block duration-300 group-hover:-translate-x-1">&lt;--</span> Back
			</a>
		</div>

		<h1 class="mt-4 mb-8 text-fluid-4xl font-semibold">
			{data.post.title}
		</h1>
	</header>

	<div data-content data-category={data.post.category}>
		{@html content}
	</div>

	{#if data.post.commentary}
		<details class="text-sm">
			<summary>Commentary</summary>
			<p>{data.post.commentary}</p>
		</details>
	{/if}

	{#if data.prev || data.next}
		<div class="my-10 h-px w-full bg-foreground/50" role="separator"></div>

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

			<a class="not-prose mt-2 text-fluid-2xl/tight font-light" href="/writing/{post.slug}">
				<span
					class="transition-colors duration-300 group-hover:text-plum-500 dark:group-hover:text-white"
				>
					{post.title}
				</span>
			</a>
		</div>
	{/if}
{/snippet}
