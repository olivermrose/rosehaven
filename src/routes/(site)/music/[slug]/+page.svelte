<script lang="ts">
	import dayjs from "dayjs";
	import Tracklist from "#lib/components/Tracklist.svelte";

	const { data } = $props();

	const review = $derived(data.review);
</script>

<div class="mx-auto max-w-4xl px-4 pt-28 pb-20 sm:px-6">
	<nav class="mb-4 flex items-center justify-between text-sm" aria-label="Review actions">
		<a class="group no-underline" href="/music">
			<span class="inline-block duration-300 group-hover:-translate-x-1">&lt;--</span> Back
		</a>

		{#if data.authenticated}
			<a class="group no-underline" href="/admin/music/{review.id}">
				Edit <span class="inline-block duration-300 group-hover:translate-x-1">--&gt;</span>
			</a>
		{/if}
	</nav>

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

		<figure class="relative left-1/2 my-10 w-[min(calc(100vw-2rem),72rem)] -translate-x-1/2">
			<img
				class="aspect-video w-full rounded-2xl object-cover outline -outline-offset-1 outline-black/10 sm:rounded-3xl dark:outline-white/10"
				src={review.artwork}
				alt="Album artwork for {review.title} by {review.artist}"
				fetchpriority="high"
			/>
		</figure>

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
