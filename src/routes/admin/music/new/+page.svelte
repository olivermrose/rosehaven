<script lang="ts">
	import { createReview } from "#lib/reviews.remote.js";
	import ReviewForm from "../ReviewForm.svelte";
</script>

<ReviewForm form={createReview} />
