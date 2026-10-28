<script lang="ts">
	import { page } from "$app/state";

	import AdminBar from "./AdminBar.svelte";

	const { data, children } = $props();

	const editing = $derived(/\/(\[id\]|new)$/.test(page.route.id ?? ""));
</script>

<svelte:head>
	<title>admin | oliver rose.</title>
</svelte:head>

<div class="min-h-dvh bg-background text-foreground" data-admin>
	{#if data.authenticated && !editing}
		<AdminBar />

		<main class="mx-auto max-w-6xl px-4 pt-10 pb-24 sm:px-6">
			{@render children?.()}
		</main>
	{:else}
		{@render children?.()}
	{/if}
</div>
