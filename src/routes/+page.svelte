<script lang="ts">
	import { animate, stagger } from "motion";
	import { onMount } from "svelte";

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

	onMount(() => {
		const animation = animate(
			".name",
			{ y: ["100%", "0%"], opacity: 1 },
			{ duration: 1.25, ease: [0.7, 0, 0.2, 1], delay: stagger(0.1) },
		);

		return () => animation.stop();
	});
</script>

<div class="relative h-svh min-h-full">
	<div class="flex items-center justify-center px-4 pt-48 sm:h-full sm:p-0">
		<h1
			class="m-auto grid w-full max-w-full grid-cols-12 text-[14vw]/[0.8] tracking-tighter uppercase sm:grid-cols-36"
		>
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each names as name}
				<span class={["-col-end-1 block overflow-hidden", name.style]}>
					<span class="name block opacity-0">{name.text}</span>
				</span>
			{/each}
		</h1>
	</div>
</div>
