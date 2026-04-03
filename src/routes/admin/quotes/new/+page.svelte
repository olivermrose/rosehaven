<script lang="ts">
	import { createQuote } from "$lib/quotes.remote.js";
	import Form from "../Form.svelte";
</script>

<h1 class="mb-10 font-nd-sans text-2xl font-light tracking-tight text-nd-bright">New Quote</h1>
<Form form={createQuote} />
