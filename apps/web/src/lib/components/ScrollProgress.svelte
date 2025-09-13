<script lang="ts">
	import { animate, scroll } from "motion";
	import { onMount } from "svelte";

	onMount(() => {
		animate(".scroll-progress", { opacity: 1 }, { duration: 0.5 });

		const cancel = scroll(
			animate([
				["#scroll-progress .left", { scaleX: [0, 1] }, { at: 0 }],
				["#scroll-progress .right", { scaleX: [1, 0] }, { ease: [0.42, 0, 0.58, 1], at: 0 }],
			]),
		);

		return () => cancel();
	});
</script>

<div id="scroll-progress" class="fixed inset-x-0 bottom-0 z-20 flex h-2 items-center opacity-0">
	<div class="bg-aloe-400 dark:bg-off-white relative h-full w-1/5"></div>

	<div class="relative h-full flex-auto">
		<div class="absolute inset-0"></div>
		<div class="left bg-aloe-400 dark:bg-off-white size-full origin-left"></div>
	</div>

	<div
		class="right bg-plum-600 absolute right-0 h-full w-1/5 origin-right dark:bg-neutral-500"
	></div>
</div>
