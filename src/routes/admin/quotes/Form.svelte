<script lang="ts">
	import type { createQuote, updateQuote } from "$lib/quotes.remote";
	import type { Quote } from "$lib/server/db/schema";

	interface Props {
		form: typeof createQuote | typeof updateQuote;
		quote?: Quote;
	}

	const { form, quote }: Props = $props();

	const issues = $derived(form.fields.allIssues());

	$effect(() => {
		if (!quote) return;

		form.fields.set({
			text: quote.text,
			quotee: quote.quotee,
			sourceTitle: quote.sourceTitle,
			sourceUrl: quote.sourceUrl ?? undefined,
		});
	});
</script>

<form class="space-y-8" {...form}>
	{#if issues}
		<div class="rounded-lg border border-nd-accent/30 bg-nd-accent/5 px-5 py-3">
			<p class="nd-label mb-2 text-nd-accent">[ERROR]</p>

			<ul class="space-y-1">
				{#each issues as issue}
					<li class="font-nd-sans text-xs text-nd-accent">{issue.message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div>
		<label for="text" class="nd-label mb-3 block">Text</label>

		<textarea
			id="text"
			class="nd-input min-h-30 resize-y"
			placeholder="Quote text"
			{...form.fields.text.as("text")}
		></textarea>
	</div>

	<div>
		<label for="quotee" class="nd-label mb-3 block">Quotee</label>

		<input
			id="quotee"
			class="nd-input"
			placeholder="Who said this"
			{...form.fields.quotee.as("text")}
		/>
	</div>

	<div class="grid gap-8 sm:grid-cols-2">
		<div>
			<label for="sourceTitle" class="nd-label mb-3 block">Source title</label>

			<input
				id="sourceTitle"
				class="nd-input"
				placeholder="Book, film, article"
				{...form.fields.sourceTitle.as("text")}
			/>
		</div>

		<div>
			<label for="sourceUrl" class="nd-label mb-3 block">
				Source URL
				<span class="text-nd-dim">(optional)</span>
			</label>

			<input
				id="sourceUrl"
				class="nd-input"
				placeholder="https://"
				{...form.fields.sourceUrl.as("url")}
			/>
		</div>
	</div>

	<div class="border-t border-nd-edge pt-8">
		<button class="nd-btn nd-btn-primary" type="submit">
			{quote ? "Save" : "Create"}
		</button>
	</div>
</form>
