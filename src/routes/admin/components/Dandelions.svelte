<script lang="ts">
	import { rand } from "$lib";
	import { animate, motion } from "motion-sv";
	import { onMount } from "svelte";

	// oxlint-disable-next-line max-lines-per-function
	onMount(() => {
		for (const seed of document.querySelectorAll(".dandelion")) {
			const initialX = rand(0, innerWidth);

			animate(
				seed,
				{
					x: initialX,
					y: -20,
					z: rand(-200, 200),
				},
				{ duration: 0 },
			);

			animate(
				seed,
				{
					y: innerHeight + 40,
					opacity: [0, 0.9, 0.9, 0],
				},
				{
					repeat: Infinity,
					duration: rand(14, 26),
					delay: -20,
					ease: "linear",
				},
			);

			animate(
				seed,
				{
					x: [initialX, initialX + rand(-120, 120)],
				},
				{
					ease: [0.45, 0, 0.55, 1],
					repeat: Infinity,
					repeatType: "reverse",
					duration: rand(5, 10),
				},
			);

			animate(
				seed,
				{
					rotateZ: [rand(0, 360), rand(0, 360) + 180],
					rotateX: rand(0, 90),
					rotateY: rand(0, 90),
				},
				{
					ease: [0.37, 0, 0.63, 1],
					repeat: Infinity,
					repeatType: "reverse",
					duration: rand(4, 9),
					delay: -3,
				},
			);
		}
	});
</script>

<motion.div
	class="fixed inset-0 -z-1"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 1.2 }}
	style={{ viewTransitionName: "persist" }}
>
	{#each { length: 25 }}
		{@const size = rand(10, 18)}

		<div
			class="dandelion absolute overflow-visible before:absolute before:inset-0 before:rounded-full"
			style:width="{size}px"
			style:height="{size}px"
		>
			<div
				class="stem absolute top-1/2 left-1/2 h-(--stem-length) w-px -translate-x-1/2"
				style:--stem-length="{size * 1.4}px"
			></div>
		</div>
	{/each}
</motion.div>

<style>
	.dandelion {
		color: light-dark(--alpha(var(--color-yellow-500) / 80%), --alpha(white / 85%));

		&::before {
			background:
				radial-gradient(
					circle at center,
					color-mix(in oklch, currentColor 80%, transparent) 0%,
					transparent 38%
				),
				conic-gradient(
					from 0deg,
					currentColor 0deg 4deg,
					transparent 4deg 30deg,
					currentColor 30deg 34deg,
					transparent 34deg 60deg,
					currentColor 60deg 64deg,
					transparent 64deg 90deg,
					currentColor 90deg 94deg,
					transparent 94deg 120deg,
					currentColor 120deg 124deg,
					transparent 124deg 150deg,
					currentColor 150deg 154deg,
					transparent 154deg 180deg,
					currentColor 180deg 184deg,
					transparent 184deg 210deg,
					currentColor 210deg 214deg,
					transparent 214deg 240deg,
					currentColor 240deg 244deg,
					transparent 244deg 270deg,
					currentColor 270deg 274deg,
					transparent 274deg 300deg,
					currentColor 300deg 304deg,
					transparent 304deg 330deg,
					currentColor 330deg 334deg,
					transparent 334deg 360deg
				);
			mask: radial-gradient(circle at center, black 0%, black 35%, transparent 70%);
			filter: blur(0.4px);
		}
	}

	.stem {
		background: linear-gradient(
			to bottom,
			color-mix(in oklch, #4a7c4f 70%, transparent),
			color-mix(in oklch, #6b9b5a 50%, transparent) 60%,
			transparent
		);
		transform-origin: top center;
		border-radius: 1px;
	}
</style>
