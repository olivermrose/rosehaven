<script lang="ts">
	import "../app.css";
	import "lenis/dist/lenis.css";
	import { SITE_NAME } from "$lib";
	import Lenis from "lenis";
	import { ModeWatcher } from "mode-watcher";
	import { frame } from "motion";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import { page } from "$app/state";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import Petals from "$lib/components/Petals.svelte";
	import ScrollProgress from "$lib/components/ScrollProgress.svelte";

	const { children } = $props();

	const { seo } = $derived(page.data);
	const title = $derived(seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME);

	onMount(() => {
		const lenis = new Lenis();
		frame.render((d) => lenis.raf(d.timestamp), true);

		return () => lenis.destroy();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={seo.description} />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={seo.article ? "article" : "website"} />
	<meta property="og:url" content="https://olivermrose.com/{seo.path.slice(1)}" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={seo.description} />
	<!-- <meta property="og:image" content={seo.image} /> TODO -->

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={seo.description} />
	<!-- <meta name="twitter:image" content={seo.image} /> TODO -->
</svelte:head>

<ModeWatcher />

<LoadingScreen>
	<Petals />
	<Header />

	<main class="relative">
		{@render children?.()}
	</main>

	<Footer />
	<ScrollProgress />
</LoadingScreen>

{#if dev}
	<Breakpoint />
{/if}
