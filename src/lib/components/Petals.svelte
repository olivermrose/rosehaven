<script lang="ts">
	import chroma from "chroma-js";
	import dayjs from "dayjs";
	import { animate, cancelFrame, frame, motion } from "motion-sv";
	import { onMount } from "svelte";

	const SIMULATE_TIME = false;
	const SIM_YEAR_SECONDS = 60;

	// These colors are how I see months :)
	const months = [
		"#61A5FA", // Jan — cornflower
		"#F472B6", // Feb — bubblegum
		"#34D399", // Mar — shamrock
		"#4DB6AC", // Apr — cyan
		"#A78BFA", // May — lavender
		"#EF4444", // Jun — coral
		"#FFA726", // Jul — tangerine
		"#FBBF23", // Aug — golden
		"#B91C1B", // Sep — terracotta
		"#D97707", // Oct — maple
		"#8D6E63", // Nov — umber
		"#80DEEA", // Dec — turquoise
	];

	let shade1 = $state("");
	let shade2 = $state("");
	let monthLabel = $state("");

	let simStart = 0;

	onMount(() => {
		simStart = Date.now();

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

	function getTime() {
		if (!SIMULATE_TIME) return dayjs();

		const elapsedMs = Date.now() - simStart;
		const yearMs = 365.25 * 86_400_000;
		const simElapsed = (elapsedMs / (SIM_YEAR_SECONDS * 1000)) * yearMs;

		return dayjs(dayjs().startOf("year").valueOf() + (simElapsed % yearMs));
	}

	function updateGradient() {
		const now = getTime();
		const month = now.month();
		const nextMonth = (month + 1) % 12;

		const monthStart = now.startOf("month");
		const monthEnd = now.endOf("month");
		const progress = now.diff(monthStart, "ms") / monthEnd.diff(monthStart, "ms");

		const primary = chroma.mix(months[month], months[nextMonth], progress, "oklch").hex();
		const [l, c, h] = chroma(primary).oklch();
		const darker = chroma.oklch(Math.max(0, l - 0.25), c, h || 0).hex();

		shade1 = primary;
		shade2 = darker;

		if (SIMULATE_TIME) {
			monthLabel = now.format("MMMM");
		}

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

{#if SIMULATE_TIME && monthLabel}
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
		<p class="text-8xl font-light tracking-tight">{monthLabel}</p>
	</div>
{/if}

<motion.div
	class="fixed inset-0"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
	style={{ viewTransitionName: "persist" }}
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
