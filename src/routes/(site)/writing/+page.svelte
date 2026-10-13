<script lang="ts">
	import dayjs from "dayjs";
	import Link from "#lib/components/Link.svelte";
	import { stagger } from "#lib/motion.js";

	const { data } = $props();

	let scrolling = $state(false);
	let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

	function onscroll() {
		scrolling = true;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => (scrolling = false), 100);
	}
</script>

<svelte:window {onscroll} />

<div class="mx-auto max-w-6xl px-6 pt-28 pb-20" {@attach stagger}>
	<div class="mb-6">
		<Link href="/" back>home</Link>
	</div>

	<hgroup class="max-w-prose">
		<h1 class="reveal text-fluid-3xl/tight" data-stagger>
			To write is to discover the essence of what remains
			<span class="font-serif italic">untold</span>.
		</h1>

		<p class="reveal mt-2" data-stagger>
			As I drift off into reverie, I find myself running through a thousand different
			scenarios of "What if?" My life is not bound by the earth I stand upon.
		</p>
	</hgroup>

	<div class="mt-16 space-y-16" data-scrolling={scrolling || undefined}>
		{#each Object.entries(data.categories) as [category, posts = []] (category)}
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
										<h3
											class="post-title truncate font-medium transition-colors duration-300 group-hover:text-plum-500 dark:group-hover:text-white"
											style:view-transition-class="post-title"
											style:view-transition-name="post-{post.id}"
										>
											{post.title}
										</h3>

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

									{#if post.publishedAt}
										<time
											class="shrink-0 text-xs text-muted-foreground tabular-nums group-hover:text-foreground"
											datetime={post.publishedAt.toISOString()}
										>
											{dayjs(post.publishedAt).format("MMM YYYY")}
										</time>
									{/if}
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
	</div>
</div>
