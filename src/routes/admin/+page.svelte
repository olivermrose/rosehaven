<script lang="ts">
	const { data } = $props();
</script>

<h1 class="mb-8 text-xl font-semibold">Dashboard</h1>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
	{#each [
		{ label: "Posts", value: data.stats.posts },
		{ label: "Published", value: data.stats.published },
		{ label: "Drafts", value: data.stats.drafts },
		{ label: "Quotes", value: data.stats.quotes },
	] as stat}
		<div class="rounded-lg border border-neutral-200 bg-white p-4">
			<p class="text-sm text-neutral-500">{stat.label}</p>
			<p class="mt-1 text-2xl font-semibold">{stat.value}</p>
		</div>
	{/each}
</div>
