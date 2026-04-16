<script lang="ts">
	import "lenis/dist/lenis.css";
	import { BASE_URL, SITE_NAME } from "$lib";
	import Lenis from "lenis";
	import { ModeWatcher } from "mode-watcher";
	import { frame } from "motion-sv";
	import { onMount } from "svelte";
	import { dev } from "$app/environment";
	import { onNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import Header from "$lib/components/Header.svelte";
	import LoadingScreen from "$lib/components/LoadingScreen.svelte";
	import Petals from "$lib/components/Petals.svelte";
	import ScrollProgress from "$lib/components/ScrollProgress.svelte";
	import Cursor from "$lib/components/Cursor.svelte";

	const { children } = $props();

	const { seo } = $derived(page.data);
	const title = $derived(seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME);
	const image = $derived(seo.image ? BASE_URL + seo.image : null);

	onMount(() => {
		const lenis = new Lenis();
		frame.render((d) => lenis.raf(d.timestamp), true);

		return () => lenis.destroy();
	});

	onNavigate((navigation) => {
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				window.scrollTo(0, 0);
				resolve();

				await navigation.complete;
			});
		});
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

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={seo.description} />

	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>

<ModeWatcher />
<Cursor />

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
