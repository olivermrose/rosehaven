<script lang="ts">
	import "../app.css";
	import "lenis/dist/lenis.css";
	import favicon from "$lib/assets/favicon.svg";
	import ScrollProgress from "$lib/components/ScrollProgress.svelte";
	import Lenis from "lenis";
	import { onMount } from "svelte";
	import { frame } from "motion";

	let { children } = $props();

	onMount(() => {
		const lenis = new Lenis();
		frame.render((d) => lenis.raf(d.timestamp), true);

		return () => lenis.destroy();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<ScrollProgress />
