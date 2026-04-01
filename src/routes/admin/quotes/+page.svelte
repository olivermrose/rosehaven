<script lang="ts">
	import { getQuotes } from "$lib/quotes.remote";

	const quotes = $derived(await getQuotes());
</script>

<div class="flex items-center justify-between">
	<h1 class="text-xl font-semibold">Quotes</h1>
	<a
		href="/admin/quotes/new"
		class="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
	>
		New quote
	</a>
</div>

{#if quotes.length === 0}
	<p class="mt-8 text-sm text-neutral-500">No quotes yet.</p>
{:else}
	<div class="mt-6 space-y-3">
		{#each quotes as quote}
			<a
				href="/admin/quotes/{quote.id}"
				class="block rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300"
			>
				<p class="text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">"{quote.text}"</p>

				<p class="mt-2 text-xs text-neutral-500">
					&mdash; {quote.quotee}, <em>{quote.sourceTitle}</em>
				</p>
			</a>
		{/each}
	</div>
{/if}
