<script lang="ts">
	import QuoteForm from "$lib/components/admin/QuoteForm.svelte";
	import { createQuote } from "$lib/quotes.remote.js";
</script>

<h1 class="mb-6 text-xl font-semibold">New Quote</h1>
<QuoteForm form={createQuote} />
