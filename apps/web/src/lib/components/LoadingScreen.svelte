<script lang="ts">
	import { animate, stagger } from "motion";
	import type { Snippet } from "svelte";
	import { expoInOut } from "$lib";

	const { children }: { children: Snippet } = $props();

	const darkColumns = [
		"dark:bg-neutral-800",
		"dark:bg-neutral-700",
		"dark:bg-neutral-600",
		"dark:bg-neutral-500",
		"dark:bg-neutral-400",
	];

	async function load() {
		// NOTE: Do not await this animate call because it will cause a flash
		animate("#loading-screen", { visibility: "visible" }, { duration: 0 });

		await animate(
			[
				[".flavor-text", { y: ["-100%", "0%"] }],
				[".column", { y: ["-100%", "0%"] }],
				[".flavor-text", { y: "100%" }],
				[
					".column",
					{ y: "100%" },
					{ duration: 1.5, delay: stagger(0.1), ease: expoInOut, at: "<" },
				],
			],
			{
				defaultTransition: {
					duration: 1,
					ease: expoInOut,
				},
			},
		);
	}
</script>

{#await load()}
	<div id="loading-screen" class="invisible">
		<div class="grid h-svh grid-cols-5 overflow-hidden">
			{#each { length: 5 }, i}
				<div class="column h-full bg-wine-600 {darkColumns[i]}"></div>
			{/each}
		</div>

		<div class="absolute right-8 bottom-8 overflow-hidden">
			<div class="flavor-text text-right">
				<p>Where silence gathers dust</p>
				<p>And memories bloom</p>
			</div>
		</div>
	</div>
{:then}
	{@render children()}
{/await}
