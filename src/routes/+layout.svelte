<script lang="ts">
	import "../app.css";
	import "lenis/dist/lenis.css";
	import favicon from "$lib/assets/favicon.svg";
	import Lenis from "lenis";
	import { onMount } from "svelte";
	import { frame } from "motion";
	import { ModeWatcher } from "mode-watcher";

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

<ModeWatcher />

<main class="relative min-h-svh">
	{@render children?.()}
</main>
