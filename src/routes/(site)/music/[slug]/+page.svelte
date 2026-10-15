<script lang="ts">
	import PageNav from "#lib/components/PageNav.svelte";
	import PostDate from "#lib/components/PostDate.svelte";
	import PostTitle from "#lib/components/PostTitle.svelte";

	import Artwork from "./Artwork.svelte";
	import Tracklist from "./Tracklist.svelte";

	const { data } = $props();

	const review = $derived(data.review);
</script>

<div class="mx-auto max-w-4xl px-6 pt-28 pb-20">
	<PageNav back="/music" edit="/admin/music/{data.review.id}" />

	<article>
		<header class="my-10 grid items-start gap-8 sm:grid-cols-[minmax(0,20rem)_1fr]">
			<div class="space-y-6">
				<Artwork {review} />

				<div>
					<PostDate date={review.publishedAt} />

					<PostTitle class="text-fluid-lg/tight">
						{review.title}
					</PostTitle>

					<p class="text-muted-foreground">
						{review.artist}{review.year ? ` · ${review.year}` : ""}
					</p>
				</div>
			</div>

			{#if review.tracklist.length}
				<Tracklist tracks={review.tracklist} open />
			{/if}
		</header>

		<div data-content>
			{@html review.content}
		</div>
	</article>
</div>
