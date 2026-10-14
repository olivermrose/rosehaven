<script lang="ts">
	import dayjs from "dayjs";
	import Link from "#lib/components/Link.svelte";
	import ArtworkTrail from "./ArtworkTrail.svelte";

	const { data } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
	<div class="mb-6">
		<Link href="/" back>home</Link>
	</div>

	<hgroup class="max-w-prose">
		<h1 class="reveal text-fluid-3xl/tight">
			Fugiat veniam eiusmod quis do est.
			<span class="font-serif italic">words</span>.
		</h1>

		<p class="reveal mt-2">
			Pariatur fugiat consequat exercitation duis fugiat ut deserunt dolore nisi non duis eu.
		</p>
	</hgroup>

	{#if data.reviews.length}
		<ul class="mt-16 border-t border-border" data-index>
			{#each data.reviews as review (review.id)}
				<li class="border-b border-border">
					<a
						class="group relative flex gap-4 py-4 no-underline"
						href="/music/{review.slug}"
					>
						<img
							class="size-14 shrink-0 rounded-lg object-cover outline -outline-offset-1 outline-black/10 dark:outline-white/10"
							src={review.artwork}
							alt=""
							loading="lazy"
							decoding="async"
						/>

						<div class="min-w-0 flex-1 self-center">
							<div class="flex items-baseline justify-between gap-6">
								<h2
									class="post-title truncate font-medium transition-colors duration-300 group-hover:text-plum-500 dark:group-hover:text-white"
									style:view-transition-class="post-title"
									style:view-transition-name="review-{review.id}"
								>
									{review.title}
								</h2>

								{#if review.publishedAt}
									<time
										class="shrink-0 text-xs text-muted-foreground tabular-nums group-hover:text-foreground"
										datetime={review.publishedAt.toISOString()}
									>
										{dayjs(review.publishedAt).format("MMM YYYY")}
									</time>
								{/if}
							</div>

							<p class="truncate text-sm text-muted-foreground">
								{review.artist}{review.year ? ` · ${review.year}` : ""}
							</p>
						</div>

						<ArtworkTrail src={review.artwork} />
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
			Nothing here yet.
		</p>
	{/if}
</div>
