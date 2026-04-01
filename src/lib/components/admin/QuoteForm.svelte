<script lang="ts">
	import { onMount } from "svelte";
	import type { createQuote, updateQuote } from "$lib/quotes.remote";
	import type { Quote } from "$lib/server/db/schema";

	interface Props {
		form: typeof createQuote | typeof updateQuote;
		quote?: Quote;
	}

	const { form, quote }: Props = $props();

	const issues = $derived(form.fields.allIssues());

	onMount(() => {
		if (!quote) return;

		form.fields.set({
			text: quote.text,
			quotee: quote.quotee,
			sourceTitle: quote.sourceTitle,
			sourceUrl: quote.sourceUrl ?? undefined,
		});
	});

	const inputClass =
		"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
</script>

<form class="space-y-5" {...form}>
	{#if issues}
		<div class="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
			<ul>
				{#each issues as issue}
					<li>{issue.message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div>
		<label for="text" class="mb-1.5 block text-sm font-medium">Text</label>
		<textarea id="text" class={inputClass} rows="4" {...form.fields.text.as("text")}></textarea>
	</div>

	<div>
		<label for="quotee" class="mb-1.5 block text-sm font-medium">Quotee</label>
		<input id="quotee" class={inputClass} {...form.fields.quotee.as("text")} />
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="sourceTitle" class="mb-1.5 block text-sm font-medium">Source Title</label>
			<input id="sourceTitle" class={inputClass} {...form.fields.sourceTitle.as("text")} />
		</div>

		<div>
			<label for="sourceUrl" class="mb-1.5 block text-sm font-medium">
				Source URL
				<span class="font-normal text-neutral-400">(optional)</span>
			</label>

			<input id="sourceUrl" class={inputClass} {...form.fields.sourceUrl.as("url")} />
		</div>
	</div>

	<div class="border-t border-neutral-200 pt-5">
		<button
			class="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
			type="submit"
		>
			{quote ? "Save" : "Create"}
		</button>
	</div>
</form>
