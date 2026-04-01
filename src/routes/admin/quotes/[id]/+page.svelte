<script lang="ts">
	import { page } from "$app/state";
	import QuoteForm from "$lib/components/admin/QuoteForm.svelte";
	import { deleteQuote, getQuote, updateQuote } from "$lib/quotes.remote";

	const [quote] = $derived(await getQuote(page.params.id!));
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-xl font-semibold">Edit Quote</h1>

	<button
		class="rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
		type="button"
		onclick={() => deleteQuote(page.params.id!)}
	>
		Delete
	</button>
</div>

{#if updateQuote.result?.success}
	<div class="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">Quote saved.</div>
{/if}

<QuoteForm form={updateQuote} {quote} />
