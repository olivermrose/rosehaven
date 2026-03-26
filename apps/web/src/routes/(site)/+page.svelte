<script lang="ts">
	import { animate, scroll, stagger } from "motion-sv";
	import { IsIdle } from "runed";
	import { onMount } from "svelte";
	import Anthology from "$lib/components/Anthology.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import Portrait from "$lib/components/Portrait.svelte";

	const { data } = $props();

	const names = [
		{
			text: "Oliver",
			style: "col-start-4 font-medium sm:col-start-6",
		},
		{
			text: "Maelle",
			style: "col-start-2 font-light sm:col-start-14",
		},
		{
			text: "Rose",
			style: "col-start-7 font-thin sm:col-start-10",
		},
	];

	const idle = new IsIdle({ timeout: 3000 });

	let hero = $state<HTMLElement>();

	onMount(async () => {
		await animate(
			[
				[".name", { y: ["100%", "0%"], opacity: 1 }, { delay: stagger(0.1) }],
				["#scroll-hint", { y: [15, 0], opacity: 1 }, { at: "<0.5" }],
			],
			{
				defaultTransition: {
					duration: 1.25,
					ease: [0.7, 0, 0.2, 1],
				},
			},
		);

		scroll(
			animate([
				[":nth-child(1 of .row)", { x: "-5%" }],
				[":nth-child(2 of .row)", { x: "10%" }, { at: "<" }],
				[":nth-child(3 of .row)", { x: "-15%" }, { at: "<" }],
				["#scroll-hint", { opacity: 0 }, { at: "<" }],
			]),
			{
				target: hero,
				offset: ["start start", "end start"],
			},
		);
	});
</script>

<div class="relative min-h-full overflow-hidden sm:h-dvh" bind:this={hero}>
	<div class="flex items-center justify-center px-4 pt-48 pb-36 sm:h-full sm:p-0">
		<h1
			class="m-auto grid w-full max-w-full grid-cols-12 text-[14vw]/[0.8] tracking-tighter uppercase sm:grid-cols-36"
		>
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each names as name}
				<span class={["row -col-end-1 block overflow-hidden", name.style]}>
					<span class="name inline-block opacity-0">{name.text}</span>
				</span>
			{/each}
		</h1>
	</div>

	<div class="absolute right-10 bottom-12">
		<div
			id="scroll-hint"
			class={["flex items-center gap-x-1 opacity-0", idle.current && "animate-bounce"]}
		>
			<span class="text-sm">Scroll</span>

			<svg class="mt-1 size-4 text-peach-400" viewBox="0 0 24 24">
				<path
					d="M1.2 8h21.6V5.5H1.2V8Zm21.6 9V8h-2.5v9h2.5Z"
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
				>
				</path>
			</svg>
		</div>
	</div>
</div>

<Portrait />
<Anthology posts={data.posts} />

<Footer />
