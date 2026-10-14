<script lang="ts">
	import PageNav from "#lib/components/PageNav.svelte";
	import ReviewHeader from "./ReviewHeader.svelte";

	const { data } = $props();

	const review = $derived(data.review);
</script>

<div class="mx-auto max-w-4xl px-6 pt-28 pb-20">
	<PageNav back="/music" edit="/admin/music/{data.review.id}" />

	<article>
		<ReviewHeader {review} />

		<div data-content>
			{@html review.content}
		</div>
	</article>
</div>
