<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";
	import Anthology from "$lib/components/Anthology.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Hero from "$lib/components/Hero.svelte";
	import Portrait from "$lib/components/Portrait.svelte";

	const { data } = $props();

	let marquee = $state<HTMLElement>();

	const { scrollYProgress: marqueeY } = $derived(
		useScroll({
			target: marquee,
			offset: ["start end", "end start"],
		}),
	);

	const marqueeX = $derived(useTransform(marqueeY, [0, 1], ["-15%", "0%"]));
</script>

<Hero />

<div class="overflow-hidden py-12 sm:py-20" bind:this={marquee}>
	<motion.div
		class="flex w-max items-center gap-x-10 text-[8vw]/none font-extralight tracking-tight uppercase opacity-5 sm:gap-x-20 sm:text-[5vw]/none"
		style={{ x: marqueeX }}
	>
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each { length: 5 }}
			<span class="whitespace-nowrap">Crafting Worlds Through Words</span>
		{/each}
	</motion.div>
</div>

<Portrait />
<Anthology posts={data.posts} />

<Footer />
