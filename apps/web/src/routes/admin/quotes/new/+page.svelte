<script lang="ts">
	import QuoteForm from "$lib/components/admin/QuoteForm.svelte";

	const { form } = $props();
</script>

<h1 class="mb-6 text-xl font-semibold">New Quote</h1>
<QuoteForm error={form?.error} />
