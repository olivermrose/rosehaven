<script lang="ts">
	import { deleteReview, getReview, updateReview } from "#lib/reviews.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import Form from "../Form.svelte";

	const review = $derived(await getReview(Number(page.params.id)));

	async function handleDelete() {
		await deleteReview(review.id);
		await goto("/admin/music");
	}
</script>

<svelte:head>
	<title>{review.title} | admin</title>
</svelte:head>

<Form form={updateReview} {review} ondelete={handleDelete} />
