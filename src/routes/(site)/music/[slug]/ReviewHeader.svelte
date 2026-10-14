<script lang="ts">
	import dayjs from "dayjs";

	import type { Review } from "#lib/server/db/schema.js";

	import Artwork from "./Artwork.svelte";
	import Tracklist from "./Tracklist.svelte";

	interface Props {
		review: Review;
	}

	const { review }: Props = $props();
</script>

<header class="my-10 grid items-start gap-8 sm:grid-cols-[minmax(0,20rem)_1fr]">
	<div class="space-y-6">
		<Artwork {review} />

		<div>
			{#if review.publishedAt}
				<time
					class="font-medium text-denim-500 dark:text-neutral-300"
					datetime={review.publishedAt.toISOString()}
				>
					{dayjs(review.publishedAt).format("MMMM D, YYYY")}
				</time>
			{/if}

			<h1 class="post-title mt-4 w-fit text-fluid-xl/tight font-semibold text-pretty">
				{review.title}
			</h1>

			<p class="text-muted-foreground">
				{review.artist}{review.year ? ` · ${review.year}` : ""}
			</p>
		</div>
	</div>

	{#if review.tracklist.length}
		<Tracklist tracks={review.tracklist} open />
	{/if}
</header>
