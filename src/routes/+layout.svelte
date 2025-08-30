<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import ScrollProgress from "$lib/components/ScrollProgress.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<ScrollProgress />
