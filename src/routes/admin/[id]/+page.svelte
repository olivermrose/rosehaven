<script lang="ts">
	import Link from "#lib/components/Link.svelte";
	import { deletePost, getPost, updatePost } from "#lib/posts.remote.js";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import Form from "../Form.svelte";

	const post = $derived(await getPost(page.params.id!));

	async function handleDelete() {
		await deletePost(post.id);
		await goto("/admin");
	}
</script>

<nav class="mb-6 flex items-center justify-between">
	<Link href="/admin" back>dashboard</Link>

	{#if post.status === "published"}
		<Link href="/writing/{post.slug}" target="_blank">view</Link>
	{/if}
</nav>

{#if updatePost.result?.success}
	<div class="mb-8 text-sm text-aloe-600 uppercase dark:text-aloe-300">saved · post updated</div>
{/if}

<Form form={updatePost} {post}>
	{#snippet actions()}
		<button class="w-full" type="button" data-variant="destructive" onclick={handleDelete}>
			delete
		</button>
	{/snippet}
</Form>
