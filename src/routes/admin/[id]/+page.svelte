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

<div class="mb-10 flex items-center justify-between">
	<h1 class="font-nd-sans text-2xl tracking-tight text-nd-bright">Edit Post</h1>

	{#if post.status === "published"}
		<a
			class="nd-label text-nd-link transition-colors hover:text-nd-bright"
			href="/writing/{post.slug}"
			target="_blank"
		>
			View post
		</a>
	{/if}
</div>

{#if updatePost.result?.success}
	<div class="mb-6 font-nd-mono text-sm tracking-wider text-nd-success uppercase">
		[SAVED] Post updated successfully
	</div>
{/if}

<Form form={updatePost} {post}>
	{#snippet actions()}
		<button class="nd-btn nd-btn-destructive w-full" type="button" onclick={handleDelete}>
			Delete
		</button>
	{/snippet}
</Form>
