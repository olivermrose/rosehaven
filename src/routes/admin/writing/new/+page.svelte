<script lang="ts">
	import { createPost } from "#lib/posts.remote.js";

	import Form from "../Form.svelte";
</script>

<svelte:head>
	<title>New post | admin</title>
</svelte:head>

<Form form={createPost} />
