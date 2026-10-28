<script lang="ts">
	import { deletePost, getPost, updatePost } from "#lib/posts.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import Form from "../Form.svelte";

	const post = $derived(await getPost(page.params.id!));

	async function handleDelete() {
		await deletePost(post.id);
		await goto("/admin/writing");
	}
</script>

<svelte:head>
	<title>{post.title} | admin</title>
</svelte:head>

<Form form={updatePost} {post} ondelete={handleDelete} />
