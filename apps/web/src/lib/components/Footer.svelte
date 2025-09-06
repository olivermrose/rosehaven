<script lang="ts">
	import { animate, inView, stagger } from "motion";
	import { onMount } from "svelte";

	let footer = $state<HTMLElement>();

	onMount(() => {
		if (!footer) return;

		const cancel = inView(
			footer,
			() => {
				animate(
					".footer-item",
					{ y: ["-100%", "0%"], opacity: 1 },
					{ duration: 0.75, delay: stagger(0.15) },
				);
			},
			{ amount: 0.8 },
		);

		return () => cancel();
	});

	function goToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
</script>

<footer class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6" bind:this={footer}>
	<div
		class="border-wine-300 group flex items-center justify-between overflow-hidden border-t pt-6 text-sm sm:px-4 dark:border-neutral-700"
	>
		<p class="footer-item opacity-0">
			&copy; {new Date().getFullYear()} Oliver Rose
		</p>

		<button class="footer-item flex items-center gap-x-1 opacity-0" type="button" onclick={goToTop}>
			Back to top

			<svg class="text-aloe-400 mb-1 size-4 -scale-y-100" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					fill-rule="evenodd"
					d="M1.2 8h21.6V5.5H1.2V8Zm21.6 9V8h-2.5v9h2.5Z"
					clip-rule="evenodd"
				>
				</path>
			</svg>
		</button>
	</div>
</footer>
