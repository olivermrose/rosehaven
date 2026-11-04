<script lang="ts">
	import { deletePost, getPost, updatePost } from "#lib/posts.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import AdminNav from "../../AdminNav.svelte";
	import Form from "../Form.svelte";

	const post = $derived(await getPost(page.params.id!));

	async function handleDelete() {
		await deletePost(post.id);
		await goto("/admin");
	}
</script>

<AdminNav
	back="/admin/writing"
	view="/writing/{post.slug}"
	published={post.status === "published"}
/>

{#if updatePost.result?.success}
	<div class="mb-8 text-sm text-aloe-600 uppercase dark:text-aloe-300">
		{#if updatePost.result.intent === "publish"}
			published · changes are live
		{:else if updatePost.result.intent === "unpublish"}
			unpublished · post taken down
		{:else if post.status === "published"}
			saved · not yet published
		{:else}
			saved · draft updated
		{/if}
	</div>
{/if}

<Form form={updatePost} {post}>
	{#snippet actions()}
		<button class="w-full" type="button" data-variant="destructive" onclick={handleDelete}>
			delete
		</button>
	{/snippet}
</Form>
