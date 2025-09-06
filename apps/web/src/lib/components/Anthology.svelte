<script lang="ts">
	import type { Post } from "$lib/schema";

	const { posts }: { posts: Post[] } = $props();

	const categories = $derived(Object.groupBy(posts, (post) => post.category));
</script>

<section id="anthology" class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6">
	<hgroup class="max-w-prose">
		<h1 class="text-fluid-3xl/[1.25]">
			To write is to discover the essence of what remains untold.
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
					<h2 class="period text-fluid-xl/[1.25] col-span-full mb-5 font-semibold">
						{category.replace("-", " ").toLowerCase()}
					</h2>

					<ul class="focus grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
						{#each posts as post (post.id)}
							<li>
								<a
									class="-m-4 flex flex-col p-4 text-left"
									title={post.title + (post.explicit ? " (Explicit)" : "")}
									href="/writing/{post.slug}"
								>
									<div class="flex items-center gap-x-2">
										<h3 class="text-fluid-base font-medium">
											{post.title}
										</h3>

										{#if post.explicit}
											<svg width="32" height="32" viewBox="0 0 24 24">
												<path
													fill="currentColor"
													d="M9 17h6v-2h-4v-2h4v-2h-4V9h4V7H9zm-4 4q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
												/>
											</svg>
										{/if}
									</div>

									<p class="text-fluid-xs mt-1">{post.excerpt}</p>
								</a>
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
