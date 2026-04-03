<script lang="ts">
	import { createPost } from "$lib/posts.remote";
	import Form from "../Form.svelte";
</script>

<h1 class="mb-10 font-nd-sans text-2xl font-light tracking-tight text-nd-bright">New Post</h1>
<Form form={createPost} />
