<script lang="ts">
	import { getQuotes } from "$lib/quotes.remote";

	const quotes = $derived(await getQuotes());
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="font-nd-sans text-2xl font-light tracking-tight text-nd-bright">Quotes</h1>
	<a href="/admin/quotes/new" class="nd-btn nd-btn-primary">New quote</a>
</div>

{#if quotes.length === 0}
	<div class="py-24 text-center">
		<p class="nd-label text-nd-dim">No quotes yet</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each quotes as quote}
			<a
				href="/admin/quotes/{quote.id}"
				class="group block rounded-lg border border-nd-edge bg-nd-surface p-5 transition-colors hover:border-nd-edge-strong"
			>
				<p class="font-nd-sans text-sm/relaxed whitespace-pre-wrap text-nd-solid italic">
					"{quote.text}"
				</p>

				<p class="nd-label mt-3 text-nd-dim">
					&mdash; {quote.quotee}, {quote.sourceTitle}
				</p>
			</a>
		{/each}
	</div>

	<p class="nd-label mt-4 text-nd-dim">{quotes.length} quotes</p>
{/if}
