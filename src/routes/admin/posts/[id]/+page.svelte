<script lang="ts">
	import PostForm from "$lib/components/admin/PostForm.svelte";

	const { data, form } = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-xl font-semibold">Edit Post</h1>

	<form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('Delete this post?')) e.preventDefault(); }}>
		<button
			type="submit"
			class="rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
		>
			Delete
		</button>
	</form>
</div>

{#if form?.success}
	<div class="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
		Post saved.
	</div>
{/if}

<PostForm post={data.post} action="?/save" error={form?.error} />
