<script lang="ts">
	import { createReview } from "#lib/remote/reviews.remote.js";

	import Form from "../Form.svelte";
</script>

<svelte:head>
	<title>New review | admin</title>
</svelte:head>

<Form form={createReview} />
