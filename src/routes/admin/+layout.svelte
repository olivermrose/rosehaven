<script lang="ts">
	import Header from "#lib/components/Header.svelte";
	import { page } from "$app/state";

	const { data, children } = $props();

	const editing = $derived(/\/(\[id\]|new)$/.test(page.route.id ?? ""));
</script>

<svelte:head>
	<title>admin | oliver rose.</title>
</svelte:head>

<Header />

<div class="min-h-dvh bg-background text-foreground" data-admin>
	{#if data.authenticated && !editing}
		<main class="mx-auto max-w-6xl px-6 pt-28 pb-20">
			{@render children?.()}
		</main>
	{:else}
		{@render children?.()}
	{/if}
</div>
