<script lang="ts">
	import { createQuote, deleteQuote, getQuotes } from "#lib/quotes.remote.js";

	const quotes = $derived(await getQuotes());
	const issues = $derived(createQuote.fields.allIssues());
</script>

<form class="space-y-8" {...createQuote}>
	{#if issues}
		<div class="border-l-2 border-peach-400 bg-peach-400/5 px-5 py-3">
			<p class="mb-2 text-peach-600 dark:text-peach-300">Error</p>

			<ul class="space-y-1">
				{#each issues as issue}
					<li class="text-sm text-peach-700 dark:text-peach-200">{issue.message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div>
		<label for="text">Quote</label>
		<textarea
			id="text"
			class="resize-y"
			placeholder="Quote text"
			rows="3"
			{...createQuote.fields.text.as("text")}></textarea>
	</div>

	<div class="grid gap-8 sm:grid-cols-3">
		<div>
			<label for="quotee">Quotee</label>
			<input
				id="quotee"
				placeholder="Who said this"
				{...createQuote.fields.quotee.as("text")}
			/>
		</div>

		<div>
			<label for="sourceTitle">Source title</label>
			<input
				id="sourceTitle"
				placeholder="Book, film, song"
				{...createQuote.fields.sourceTitle.as("text")}
			/>
		</div>

		<div>
			<label class="flex items-center" for="sourceUrl">
				Source URL <span class="ml-1.5 text-muted-foreground normal-case">(optional)</span>
			</label>
			<input
				id="sourceUrl"
				placeholder="https://"
				{...createQuote.fields.sourceUrl.as("url")}
			/>
		</div>
	</div>

	<button data-variant="primary" type="submit">Add Quote</button>
</form>

<ul class="mt-12 border-y border-foreground/15">
	{#each quotes as quote (quote.id)}
		<li
			class="flex items-start justify-between gap-6 border-b border-border py-4 last:border-none"
		>
			<div class="min-w-0">
				<p class="whitespace-pre">“{quote.text}”</p>
				<p class="mt-1 text-sm text-muted-foreground">
					{quote.quotee}, {quote.sourceTitle}
				</p>
			</div>

			<button type="button" data-variant="destructive" onclick={() => deleteQuote(quote.id)}>
				delete
			</button>
		</li>
	{:else}
		<li class="py-4 text-sm text-muted-foreground">No quotes yet.</li>
	{/each}
</ul>
