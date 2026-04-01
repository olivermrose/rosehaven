<script lang="ts">
	import PostForm from "$lib/components/admin/PostForm.svelte";
	import { createPost } from "$lib/posts.remote";
</script>

<h1 class="mb-6 text-xl font-semibold">New Post</h1>

<PostForm form={createPost} />
