<script lang="ts">
	import { PersistedState } from "runed";
	import { onMount } from "svelte";
	import type { Post } from "$lib/server/db/schema";

	const { posts }: { posts: Post[] } = $props();

	const seen = new PersistedState<number[]>("rosehaven:seen-posts", [], {
		storage: "local",
	});

	let newPosts = $state.raw(new Set<number>());
	const categories = $derived(Object.groupBy(posts, (post) => post.category));

	onMount(() => {
		const ids = posts.map((p) => p.id);

		if (seen.current.length) {
			const seenIds = new Set(seen.current);
			newPosts = new Set(ids.filter((id) => !seenIds.has(id)));
		}

		seen.current = ids;
	});
</script>

<section id="anthology" class="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
	<hgroup class="max-w-prose">
		<h1 class="text-fluid-3xl/tight">
			To write is to discover the essence of what remains
			<span class="font-serif italic">untold</span>.
		</h1>

		<p class="mt-2">
			As I drift off into reverie, I find myself running through a thousand different scenarios of
			"What if?" My life is not bound by the earth I stand upon.
		</p>
	</hgroup>

	<div class="space-y-12 pt-10">
		{#each Object.entries(categories) as [category, posts] (category)}
			<ul id={category}>
				<li class="flex flex-col">
					<h2 class="period col-span-full mb-5 text-fluid-xl/tight font-semibold">
						{category.replace("-", " ").toLowerCase()}
					</h2>

					<ul class="focus grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
						{#each posts as post (post.id)}
							{@const title = post.title + (post.explicit ? " (Explicit)" : "")}

							<li class="relative -m-4 flex flex-col p-4">
								<a class="absolute inset-0 z-1" {title} href="/writing/{post.slug}">
									<span class="sr-only">{title}</span>
								</a>

								<div class="flex items-center gap-x-2">
									<h3
										class="post-title line-clamp-2 text-fluid-base font-medium"
										style:view-transition-class="post-title"
										style:view-transition-name="post-{post.id}"
									>
										{post.title}
									</h3>

									{#if post.explicit}
										<svg class="size-5 opacity-30" width="32" height="32" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M9 17h6v-2h-4v-2h4v-2h-4V9h4V7H9zm-4 4q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
											/>
										</svg>
									{/if}

									{#if newPosts.has(post.id)}
										<span
											class="inline-block size-2 shrink-0 rounded-full bg-peach-400"
											aria-label="New"
										></span>
									{/if}
								</div>

								<p class="mt-1 text-fluid-xs">{post.excerpt}</p>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		{/each}
	</div>
</section>

<style>
	.focus {
		&:has(> li:hover) li:not(:hover) {
			filter: blur(2px);
		}

		> * {
			transition: filter 300ms ease-in-out;
		}
	}
</style>
