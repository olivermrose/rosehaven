<script lang="ts">
	import "lenis/dist/lenis.css";
	import "../app.css";
	import Lenis from "lenis";
	import { ModeWatcher } from "mode-watcher";
	import { frame } from "motion-sv";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import { page } from "$app/state";
	import { PUBLIC_BASE_URL, PUBLIC_SITE_NAME } from "$env/static/public";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import Header from "$lib/components/Header.svelte";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import Petals from "$lib/components/Petals.svelte";
	import ScrollProgress from "$lib/components/ScrollProgress.svelte";

	const { children } = $props();

	const { seo } = $derived(page.data);
	const title = $derived(seo.title ? `${seo.title} | ${PUBLIC_SITE_NAME}` : PUBLIC_SITE_NAME);
	const image = $derived(seo.image ? PUBLIC_BASE_URL + seo.image : null);

	onMount(() => {
		const lenis = new Lenis();
		frame.render((d) => lenis.raf(d.timestamp), true);

		return () => lenis.destroy();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={seo.description} />

	<meta property="og:site_name" content={PUBLIC_SITE_NAME} />
	<meta property="og:type" content={seo.article ? "article" : "website"} />
	<meta property="og:url" content="https://olivermrose.com/{seo.path.slice(1)}" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={seo.description} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={seo.description} />

	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>

<ModeWatcher />

<LoadingScreen>
	<Petals />
	<Header />

	<main class="relative">
		{@render children?.()}
	</main>

	<ScrollProgress />
</LoadingScreen>

{#if dev}
	<Breakpoint />
{/if}
