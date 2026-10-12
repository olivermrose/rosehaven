<script lang="ts">
	import { deleteReview, getReview, updateReview } from "#lib/reviews.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import ReviewForm from "../ReviewForm.svelte";

	const review = $derived(await getReview(Number(page.params.id)));

	async function handleDelete() {
		await deleteReview(review.id);
		await goto("/admin/music");
	}
</script>

<nav class="mb-8 flex items-center justify-between font-medium">
	<a class="group text-sm no-underline" href="/admin/music">
		<span class="inline-block duration-300 group-hover:-translate-x-1">&lt;--</span> Back
	</a>

	{#if review.status === "published"}
		<a class="group text-sm no-underline" href="/music/{review.slug}" target="_blank">
			View <span class="inline-block duration-300 group-hover:translate-x-1">--&gt;</span>
		</a>
	{/if}
</nav>

{#if updateReview.result?.success}
	<div class="mb-8 text-sm text-aloe-600 uppercase dark:text-aloe-300">
		saved · review updated
	</div>
{/if}

<ReviewForm form={updateReview} {review}>
	{#snippet actions()}
		<button class="w-full" type="button" data-variant="destructive" onclick={handleDelete}>
			delete
		</button>
	{/snippet}
</ReviewForm>
