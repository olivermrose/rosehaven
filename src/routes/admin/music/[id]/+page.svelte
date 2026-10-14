<script lang="ts">
	import { deleteReview, getReview, updateReview } from "#lib/reviews.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import AdminNav from "../../AdminNav.svelte";
	import Form from "../Form.svelte";

	const review = $derived(await getReview(Number(page.params.id)));

	async function handleDelete() {
		await deleteReview(review.id);
		await goto("/admin/music");
	}
</script>

<AdminNav
	back="/admin/music"
	view="/music/{review.slug}"
	published={review.status === "published"}
/>

{#if updateReview.result?.success}
	<div class="mb-8 text-sm text-aloe-600 uppercase dark:text-aloe-300">
		saved · review updated
	</div>
{/if}

<Form form={updateReview} {review}>
	{#snippet actions()}
		<button class="w-full" type="button" data-variant="destructive" onclick={handleDelete}>
			delete
		</button>
	{/snippet}
</Form>
