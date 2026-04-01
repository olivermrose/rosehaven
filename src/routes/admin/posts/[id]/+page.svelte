<script lang="ts">
	import { page } from "$app/state";
	import PostForm from "$lib/components/admin/PostForm.svelte";
	import { deletePost, getPost, updatePost } from "$lib/posts.remote";

	const post = $derived(await getPost(page.params.id!));
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-xl font-semibold">Edit Post</h1>

	<button
		class="rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
		onclick={() => deletePost(post.id)}
	>
		Delete
	</button>
</div>

{#if updatePost.result?.success}
	<div class="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">Post saved.</div>
{/if}

<PostForm form={updatePost} {post} />
