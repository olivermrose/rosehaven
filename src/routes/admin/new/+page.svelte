<script lang="ts">
	import { createPost } from "#lib/posts.remote.js";
	import Form from "../Form.svelte";
</script>

<Form form={createPost} />
