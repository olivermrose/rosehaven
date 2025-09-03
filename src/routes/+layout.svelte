<script lang="ts">
	import "../app.css";
	import "lenis/dist/lenis.css";
	import favicon from "$lib/assets/favicon.svg";
	import Lenis from "lenis";
	import { onMount } from "svelte";
	import { frame } from "motion";
	import { ModeWatcher } from "mode-watcher";
	import { dev } from "$app/environment";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import Header from "$lib/components/Header.svelte";

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

<LoadingScreen>
	<Header />

	<main class="relative min-h-svh">
		{@render children?.()}
	</main>
</LoadingScreen>

{#if dev}
	<Breakpoint />
{/if}
