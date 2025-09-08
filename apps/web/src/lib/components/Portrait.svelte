<script lang="ts">
	import { Canvas } from "@threlte/core";
	import { animate, scroll } from "motion";
	import { onMount } from "svelte";
	import { expoInOut } from "$lib";
	import Distortion from "./Distortion.svelte";

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
				offset: ["start 0.65", "end center"],
			},
		);

		return () => cancel();
	});
</script>

<div class="relative h-[400dvh] px-4 sm:px-6" bind:this={container}>
	<div class="sticky top-0 flex h-dvh items-center justify-center">
		<div class="relative h-full max-h-[75dvh] uppercase md:max-h-[85dvh]">
			<div class="tag">
				<div class="left text-fluid-7xl/none opacity-0">
					<span class="font-serif">C</span>raf<span class="font-serif">t</span>in<span
						class="font-serif">g</span
					>
				</div>
			</div>

			<div id="portrait" class="rounded-bl-4xl rounded-tr-4xl aspect-[3/4] h-full overflow-hidden">
				<Canvas>
					<Distortion src="https://r2.olivermrose.com/self.jpg" />
				</Canvas>
			</div>

			<div class="tag">
				<div class="right text-fluid-7xl/none opacity-0">
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

	.tag {
		position: absolute;
		overflow: hidden;
		z-index: 10;
		pointer-events: none;
	}

	:nth-child(1 of .tag) {
		top: 0.75rem;
		left: 0.75rem;

		@variant lg {
			top: 20%;
			left: -65%;
			translate: 50% -50%;
		}
	}

	:nth-child(2 of .tag) {
		bottom: 0.75rem;
		right: 0.75rem;

		@variant lg {
			bottom: 20%;
			right: -55%;
			translate: -50% 50%;
		}
	}
</style>
