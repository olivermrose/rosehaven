<script lang="ts">
	import { expoInOut } from "$lib";
	import { animate, scroll } from "motion";
	import { onMount } from "svelte";

	let container = $state<HTMLElement>();

	onMount(() => {
		const cancel = scroll(
			animate(
				[
					[".tag > *", { opacity: 1 }, { duration: 0 }],
					["#portrait", { "--clip-x": "0%" }],
					[".tag .left", { x: ["100%", "0%"] }, { at: "-0.5" }],
					[".tag .right", { x: ["-100%", "0%"] }, { at: "<" }],
					["#portrait", { "--clip-y": "50%" }],
					[".tag .left", { y: "-100%" }, { at: "-0.25" }],
					[".tag .right", { y: "100%" }, { at: "<" }],
				],
				{
					defaultTransition: {
						duration: 1.25,
						ease: expoInOut,
					},
				},
			),
			{
				target: container,
				offset: ["start start", "end center"],
			},
		);

		return () => cancel();
	});
</script>

<div class="relative h-[400svh] px-4 sm:px-6" bind:this={container}>
	<div class="sticky top-0 flex h-svh items-center justify-center">
		<div class="relative h-full max-h-[75svh] uppercase md:max-h-[85svh]">
			<div class="tag absolute z-10 overflow-hidden">
				<div class="left text-fluid-6xl/none opacity-0">
					<span class="font-serif">C</span>raf<span class="font-serif">t</span>in<span
						class="font-serif">g</span
					>
				</div>
			</div>

			<img
				id="portrait"
				class="rounded-tr-4xl rounded-bl-4xl size-full object-cover"
				src="https://r2.olivermrose.com/self.jpg"
				alt="Portrait of Oliver Rose"
				decoding="async"
				loading="lazy"
			/>

			<div class="tag absolute z-10 overflow-hidden">
				<div class="right text-fluid-6xl/none opacity-0">
					W<span class="font-serif italic">o</span>rld<span class="font-serif">s</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@reference "../../app.css";

	#portrait {
		--clip-x: 50%;
		--clip-y: 0%;
		clip-path: inset(var(--clip-y) var(--clip-x));
	}

	:nth-child(1 of .tag) {
		top: 0.75rem;
		left: 0.75rem;

		@variant md {
			top: 20%;
			left: -50%;
			translate: 50% -50%;
		}
	}

	:nth-child(2 of .tag) {
		bottom: 0.75rem;
		right: 0.75rem;

		@variant md {
			bottom: 20%;
			right: -50%;
			translate: -50% 50%;
		}
	}
</style>
