<script lang="ts">
	import { Add01Icon, Delete02Icon, Link01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	import Alert from "#lib/components/admin/Alert.svelte";
	import Quote from "#lib/components/Quote.svelte";
	import { createQuote, deleteQuote, getQuotes } from "#lib/remote/quotes.remote.js";

	const quotes = $derived(await getQuotes());
	const issues = $derived(createQuote.fields.allIssues());
	const hasSourceUrl = $derived(!!createQuote.fields.sourceUrl.value());

	const captionField =
		"field-bare field-sizing-content w-auto! min-w-8 py-0.5 text-sm text-inherit focus-visible:text-foreground";

	let deleteTarget = $state<number>();

	async function remove(id: number) {
		deleteTarget = id;

		try {
			await deleteQuote(id);
		} finally {
			deleteTarget = undefined;
		}
	}
</script>

<svelte:head>
	<title>Quotes | admin</title>
</svelte:head>

<form class="flex items-start justify-between py-5" {...createQuote}>
	<div class="space-y-5">
		{#if issues?.length}
			<Alert tone="error" title="This quote couldn't be added">
				<ul class="space-y-0.5">
					{#each issues as issue, i (i)}
						<li>{issue.message}</li>
					{/each}
				</ul>
			</Alert>
		{/if}

		<div class="py-2">
			<div class="border-l-2 border-l-muted pl-3">
				<label class="sr-only" for="text">Quote</label>
				<textarea
					id="text"
					class="field-bare field-sizing-content resize-none py-0.5 text-base"
					placeholder="Add a quote…"
					rows="2"
					{...createQuote.fields.text.as("text")}></textarea>
			</div>

			<div class="mt-2 flex flex-wrap items-baseline text-sm text-muted-foreground">
				<span aria-hidden="true">&mdash;&nbsp;</span>

				<label class="sr-only" for="quotee">Quotee</label>
				<input
					id="quotee"
					class={captionField}
					placeholder="Who said it"
					{...createQuote.fields.quotee.as("text")}
				/>

				<span aria-hidden="true">,&nbsp;</span>

				<label class="sr-only" for="sourceTitle">Source</label>
				<input
					id="sourceTitle"
					class={[captionField, "italic", hasSourceUrl && "underline"]}
					placeholder="Source"
					{...createQuote.fields.sourceTitle.as("text")}
				/>
			</div>

			<div class="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
				<HugeiconsIcon class="shrink-0" icon={Link01Icon} size={14} strokeWidth={1.75} />

				<label class="sr-only" for="sourceUrl">Source link (optional)</label>
				<input
					id="sourceUrl"
					class={captionField}
					placeholder="Source link (optional)"
					{...createQuote.fields.sourceUrl.as("url")}
				/>
			</div>
		</div>
	</div>

	<div>
		{const creating = $derived(createQuote.pending > 0)}

		<button
			title="Add quote"
			type="submit"
			data-variant="ghost"
			data-size="icon-sm"
			disabled={creating}
		>
			<HugeiconsIcon
				class={creating ? "animate-spin" : ""}
				icon={creating ? Loading03Icon : Add01Icon}
				size={16}
				strokeWidth={2}
			/>
		</button>
	</div>
</form>

<ul class="divide-y divide-border border-y border-border">
	{#each quotes as quote (quote.id)}
		{const deleting = $derived(deleteTarget === quote.id)}

		<li class="flex items-start justify-between gap-6 py-5">
			<Quote {quote} />

			<button
				title="Delete quote"
				type="button"
				disabled={deleting}
				aria-label="Delete quote by {quote.quotee}"
				data-variant="destructive"
				data-size="icon-sm"
				onclick={() => remove(quote.id)}
			>
				<HugeiconsIcon
					class={deleting ? "animate-spin" : ""}
					icon={deleting ? Loading03Icon : Delete02Icon}
					size={16}
					strokeWidth={1.75}
				/>
			</button>
		</li>
	{:else}
		<li class="py-16 text-center">
			<p class="font-medium">No quotes yet</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Quotes you add here rotate through the site.
			</p>
		</li>
	{/each}
</ul>
