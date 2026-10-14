<script lang="ts">
	import { createReview } from "#lib/reviews.remote.js";

	import Form from "../Form.svelte";
</script>

<Form form={createReview} />
