<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { deletePost, getPost, updatePost } from "$lib/posts.remote";
	import Form from "../Form.svelte";

	const post = $derived(await getPost(page.params.id!));

	async function handleDelete() {
		await deletePost(post.id);
		await goto("/admin");
	}
</script>

<nav class="mb-8 flex items-center justify-between font-medium">
	<a class="group text-sm no-underline" href="/admin">
		<span class="inline-block duration-300 group-hover:-translate-x-1">&lt;--</span> Back
	</a>

	{#if post.status === "published"}
		<a class="group text-sm no-underline" href="/writing/{post.slug}" target="_blank">
			View <span class="inline-block duration-300 group-hover:translate-x-1">--&gt;</span>
		</a>
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
