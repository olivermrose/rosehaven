<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { deleteQuote, getQuote, updateQuote } from "$lib/quotes.remote";
	import Form from "../Form.svelte";

	const [quote] = $derived(await getQuote(page.params.id!));

	async function handleDelete() {
		await deleteQuote(quote.id);
		await goto("/admin/quotes");
	}
</script>

<div class="mb-10 flex items-center justify-between">
	<h1 class="font-nd-sans text-2xl tracking-tight text-nd-bright">Edit Quote</h1>

	<button class="nd-btn nd-btn-destructive" type="button" onclick={handleDelete}>Delete</button>
</div>

{#if updateQuote.result?.success}
	<div class="mb-6 font-nd-mono text-xs tracking-wider text-nd-success uppercase">
		[SAVED] Quote updated successfully
	</div>
{/if}

<Form form={updateQuote} {quote} />
