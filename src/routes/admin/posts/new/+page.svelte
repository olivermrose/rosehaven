<script lang="ts">
	import PostForm from "$lib/components/admin/PostForm.svelte";

	const { form } = $props();
</script>

<h1 class="mb-6 text-xl font-semibold">New Post</h1>
<PostForm error={form?.error} />
