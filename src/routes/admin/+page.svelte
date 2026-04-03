<script lang="ts">
	const { data } = $props();

	const stats = $derived([
		{ label: "Published", value: data.stats.published, color: "text-nd-success" },
		{ label: "Drafts", value: data.stats.drafts, color: "text-nd-warning" },
		{ label: "Quotes", value: data.stats.quotes, color: "text-nd-solid" },
	]);
</script>

<div class="mb-16">
	<p class="nd-label mb-3">Total posts</p>
	<p class="font-nd-display text-7xl/none tracking-tight text-nd-bright">
		{data.stats.posts}
	</p>
</div>

<div class="grid grid-cols-3 gap-6">
	{#each stats as stat}
		<div class="rounded-xl border border-nd-edge bg-nd-surface p-6">
			<p class="nd-label mb-4">{stat.label}</p>

			<p class="font-nd-mono text-4xl/none {stat.color}">
				{stat.value}
			</p>
		</div>
	{/each}
</div>
