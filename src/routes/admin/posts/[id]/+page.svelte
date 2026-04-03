<script lang="ts">
	import { page } from "$app/state";
	import { deletePost, getPost, updatePost } from "$lib/posts.remote";
	import Form from "../Form.svelte";

	const post = $derived(await getPost(page.params.id!));
</script>

<div class="mb-10">
	<h1 class="font-nd-sans text-2xl tracking-tight text-nd-bright">Edit Post</h1>
</div>

{#if updatePost.result?.success}
	<div class="mb-6 font-nd-mono text-sm tracking-wider text-nd-success uppercase">
		[SAVED] Post updated successfully
	</div>
{/if}

<Form form={updatePost} {post}>
	{#snippet actions()}
		<button
			class="nd-btn nd-btn-destructive w-full"
			type="button"
			onclick={() => deletePost(post.id)}
		>
			Delete
		</button>
	{/snippet}
</Form>
