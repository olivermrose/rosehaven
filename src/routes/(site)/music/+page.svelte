<script lang="ts">
	import dayjs from "dayjs";
	import { artworkAt } from "#lib";
	import Collection from "#lib/components/Collection.svelte";
	import ArtworkTrail from "./ArtworkTrail.svelte";

	const { data } = $props();
</script>

<Collection empty={data.reviews.length === 0}>
	{#snippet heading()}
		To write is to discover the essence of what remains
		<span class="font-serif italic">untold</span>.
	{/snippet}

	{#snippet lead()}
		As I drift off into reverie, I find myself running through a thousand different scenarios of
		"What if?" My life is not bound by the earth I stand upon.
	{/snippet}

	<ul data-index data-stagger>
		{#each data.reviews as review (review.id)}
			<li class="border-b border-border">
				<a class="group relative flex gap-4 py-4 no-underline" href="/music/{review.slug}">
					<img
						class="size-14 shrink-0 rounded-lg object-cover outline -outline-offset-1 outline-black/10 dark:outline-white/10"
						src={artworkAt(review.artwork, 120)}
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

					<ArtworkTrail src={artworkAt(review.artwork, 400)} />
				</a>
			</li>
		{/each}
	</ul>
</Collection>
