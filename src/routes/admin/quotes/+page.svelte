<script lang="ts">
	import { Delete02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	import Alert from "#lib/components/admin/Alert.svelte";
	import ListHeader from "#lib/components/admin/ListHeader.svelte";
	import { createQuote, deleteQuote, getQuotes } from "#lib/quotes.remote.js";

	const quotes = $derived(await getQuotes());
	const issues = $derived(createQuote.fields.allIssues());

	let deleting = $state<number>();

	async function remove(id: number) {
		deleting = id;

		try {
			await deleteQuote(id);
		} finally {
			deleting = undefined;
		}
	}
</script>

<ListHeader title="Quotes" />

<form
	class="rounded-xl border border-border bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
	{...createQuote}
>
	<div class="space-y-5 p-5">
		{#if issues?.length}
			<Alert tone="error" title="This quote couldn't be added">
				<ul class="space-y-0.5">
					{#each issues as issue, i (i)}
						<li>{issue.message}</li>
					{/each}
				</ul>
			</Alert>
		{/if}

		<div>
			<label class="sr-only" for="text">Quote</label>
			<textarea
				id="text"
				class="field-bare field-sizing-content resize-none text-base/7"
				placeholder="Add a quote…"
				rows="2"
				{...createQuote.fields.text.as("text")}></textarea>
		</div>

		<div class="grid gap-4 sm:grid-cols-3">
			<div>
				<label for="quotee">Quotee</label>
				<input
					id="quotee"
					placeholder="Who said it"
					{...createQuote.fields.quotee.as("text")}
				/>
			</div>

			<div>
				<label for="sourceTitle">Source</label>
				<input
					id="sourceTitle"
					placeholder="Book, film, song"
					{...createQuote.fields.sourceTitle.as("text")}
				/>
			</div>

			<div>
				<label for="sourceUrl">
					Source link <span class="font-normal text-muted-foreground">(optional)</span>
				</label>
				<input
					id="sourceUrl"
					placeholder="https://"
					{...createQuote.fields.sourceUrl.as("url")}
				/>
			</div>
		</div>
	</div>

	<div class="flex justify-end border-t border-border px-5 py-3">
		<button data-variant="primary" type="submit" disabled={createQuote.pending > 0}>
			{#if createQuote.pending}
				<HugeiconsIcon
					class="animate-spin"
					icon={Loading03Icon}
					size={14}
					strokeWidth={2}
				/>
			{/if}

			Add quote
		</button>
	</div>
</form>

<ul class="mt-10 divide-y divide-border border-y border-border">
	{#each quotes as quote (quote.id)}
		<li class="group flex items-start justify-between gap-6 py-5">
			<figure class="min-w-0">
				<blockquote class="whitespace-pre-wrap" cite={quote.sourceUrl}>
					<p class="text-pretty">“{quote.text}”</p>
				</blockquote>

				<figcaption class="mt-2 text-sm text-muted-foreground">
					&mdash; {quote.quotee}{quote.sourceTitle ? ", " : ""}

					{#if quote.sourceUrl}
						<a
							class="underline decoration-border underline-offset-2 transition-colors hover:text-foreground hover:decoration-current"
							href={quote.sourceUrl}
							target="_blank"
						>
							<cite>{quote.sourceTitle}</cite>
						</a>
					{:else}
						<cite>{quote.sourceTitle}</cite>
					{/if}
				</figcaption>
			</figure>

			<button
				class="transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-fine:opacity-0"
				type="button"
				data-variant="destructive"
				data-size="icon-sm"
				aria-label="Delete quote by {quote.quotee}"
				title="Delete quote"
				disabled={deleting === quote.id}
				onclick={() => remove(quote.id)}
			>
				<HugeiconsIcon
					class={deleting === quote.id ? "animate-spin" : ""}
					icon={deleting === quote.id ? Loading03Icon : Delete02Icon}
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
