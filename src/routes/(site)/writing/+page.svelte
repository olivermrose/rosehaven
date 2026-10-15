<script lang="ts">
	import dayjs from "dayjs";

	import Collection from "#lib/components/Collection.svelte";
	import PostDate from "#lib/components/PostDate.svelte";
	import PostTitle from "#lib/components/PostTitle.svelte";

	const { data } = $props();

	const categories = $derived(Object.entries(data.categories));
</script>

<Collection class="space-y-12" empty={categories.length === 0}>
	{#snippet heading()}
		To write is to discover the essence of what remains
		<span class="font-serif italic">untold</span>.
	{/snippet}

	{#snippet lead()}
		As I drift off into reverie, I find myself running through a thousand different scenarios of
		"What if?" My life is not bound by the earth I stand upon.
	{/snippet}

	{#each categories as [category, posts = []] (category)}
		<section id={category} class="scroll-mt-28" data-stagger>
			<div class="flex items-baseline justify-between border-b border-border pb-3">
				<h2 class="text-fluid-lg font-medium">
					<span class="period">{category}</span>
				</h2>

				<span class="text-xs font-medium tabular-nums">
					{posts.length}
				</span>
			</div>

			<ul data-index>
				{#each posts as post (post.id)}
					<li class="border-b border-border">
						<a class="group block py-4 no-underline" href="/writing/{post.slug}">
							<div class="flex items-baseline justify-between gap-6">
								<div class="flex min-w-0 items-center gap-2">
									<PostTitle as="h3" listing>
										{post.title}
									</PostTitle>

									{#if post.explicit}
										<svg
											class="size-4 shrink-0 opacity-30"
											viewBox="0 0 24 24"
											aria-label="Explicit"
										>
											<path
												fill="currentColor"
												d="M9 17h6v-2h-4v-2h4v-2h-4V9h4V7H9zm-4 4q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
											/>
										</svg>
									{/if}
								</div>

								<PostDate date={post.publishedAt} listing />
							</div>

							<div data-excerpt>
								<div>
									<p class="line-clamp-2 pt-1.5 text-sm">
										{post.excerpt}
									</p>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</Collection>
