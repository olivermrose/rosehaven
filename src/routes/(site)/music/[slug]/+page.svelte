<script lang="ts">
	import dayjs from "dayjs";
	import Ombre from "#lib/components/Ombre.svelte";
	import PageNav from "#lib/components/PageNav.svelte";
	import Tracklist from "#lib/components/Tracklist.svelte";
	import { extractPaletteFromUrl } from "#lib/palette.js";

	const { data } = $props();

	const review = $derived(data.review);
</script>

<div class="mx-auto max-w-4xl px-6 pt-28 pb-20">
	<PageNav back="/music" edit="/admin/music/{data.review.id}" />

	<article>
		<header>
			{#if review.publishedAt}
				<time
					class="font-medium text-denim-500 dark:text-neutral-300"
					datetime={review.publishedAt.toISOString()}
				>
					{dayjs(review.publishedAt).format("MMMM D, YYYY")}
				</time>
			{/if}

			<h1
				class="post-title mt-4 w-fit text-fluid-4xl font-semibold text-pretty"
				style:view-transition-class="post-title"
				style:view-transition-name="review-{review.id}"
			>
				{review.title}
			</h1>

			<p class="text-fluid-base text-muted-foreground">
				{review.artist}{review.year ? ` · ${review.year}` : ""}
			</p>
		</header>

		<div class="relative left-1/2 my-10 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2">
			{const palette = await extractPaletteFromUrl(review.artwork)}

			{#if palette}
				<div class="absolute inset-0 -z-10 overflow-hidden rounded-xl sm:rounded-2xl">
					<Ombre vibrant={palette.vibrant} muted={palette.muted} />

					<div
						class="pointer-events-none absolute inset-0 rounded-[inherit] cutout"
					></div>
				</div>
			{/if}

			<figure class="p-6">
				<img
					class="aspect-video w-full rounded-lg object-cover shadow outline -outline-offset-1 outline-black/10 sm:rounded-xl dark:outline-white/10"
					src={review.artwork}
					alt="Album artwork for {review.title} by {review.artist}"
					fetchpriority="high"
				/>
			</figure>
		</div>

		{#if review.tracklist.length}
			<div class="mb-10">
				<Tracklist tracks={review.tracklist} />
			</div>
		{/if}

		<div data-content>
			{@html review.content}
		</div>
	</article>
</div>
