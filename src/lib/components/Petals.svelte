<script lang="ts">
	import chroma from "chroma-js";
	import dayjs from "dayjs";
	import { animate, cancelFrame, frame, motion } from "motion-sv";
	import { onMount } from "svelte";

	const seasons = [
		["#FFE438", "#88C924"], // Spring
		["#F0D83A", "#FFA02B"], // Summer
		["#C7781E", "#EB3636"], // Autumn
		["#A3D8FF", "#BDFFFF"], // Winter
	];

	let shade1 = $state("");
	let shade2 = $state("");

	onMount(() => {
		updateGradient();

		for (const petal of document.querySelectorAll(".petal")) {
			const initialX = rand(0, innerWidth);

			animate(
				petal,
				{
					x: initialX,
					y: 0,
					z: rand(-200, 200),
				},
				{
					duration: 0,
				},
			);

			animate(
				petal,
				{
					y: innerHeight + 50,
					opacity: 0,
				},
				{
					repeat: Infinity,
					duration: rand(6, 15),
					delay: -15,
				},
			);

			animate(
				petal,
				{
					x: [initialX, initialX + 100],
					rotateZ: rand(0, 180),
				},
				{
					ease: [0.37, 0, 0.63, 1],
					repeat: Infinity,
					repeatType: "reverse",
					duration: rand(4, 8),
				},
			);

			animate(
				petal,
				{
					rotateX: rand(0, 360),
					rotateY: rand(0, 360),
				},
				{
					ease: [0.37, 0, 0.63, 1],
					repeat: Infinity,
					repeatType: "reverse",
					duration: rand(2, 8),
					delay: -5,
				},
			);
		}

		return () => cancelFrame(updateGradient);
	});

	function updateGradient() {
		const now = dayjs();

		const currentSeason = Math.floor(now.month() / 3) % 4;
		const nextSeason = Math.floor((now.month() + 1) / 3) % 4;

		const [from1, to1] = seasons[currentSeason];
		const [from2, to2] = seasons[nextSeason];

		const progress = now.diff(now.startOf("month"), "seconds") / (30 * 86_400);

		shade1 = chroma.mix(from1, from2, progress, "oklch").hex();
		shade2 = chroma.mix(to1, to2, progress, "oklch").hex();

		frame.render(updateGradient, true);
	}

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function generateDiagonals() {
		return [
			rand(12, 12 + Math.floor(Math.random() * 10)),
			rand(1, Math.floor((12 - Math.floor(rand(0, 12) / 3)) / 4)),
		];
	}
</script>

<motion.div
	class="fixed inset-0"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
>
	{#each { length: 25 }}
		{@const [main, anti] = generateDiagonals()}

		<div
			class="petal absolute size-3 bg-linear-to-br/oklch from-(--petal-from) to-(--petal-to)"
			style:border-radius="{main}px {anti}px"
			style:--petal-from={shade1}
			style:--petal-to={shade2}
		></div>
	{/each}
</motion.div>
