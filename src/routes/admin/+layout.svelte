<script lang="ts">
	import Header from "$lib/components/Header.svelte";

	const { data, children } = $props();
</script>

<svelte:head>
	<title>admin | oliver rose.</title>
</svelte:head>

<Header />

{#if data.authenticated}
	<main class="mx-auto max-w-7xl px-6 pt-32 pb-24">
		{@render children?.()}
	</main>
{:else}
	{@render children?.()}
{/if}
