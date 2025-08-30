<script lang="ts">
	import { animate, scroll } from "motion";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	onMount(() => {
		animate(".scroll-progress", { opacity: [0, 1] }, { duration: 0.3 });
	});

	$effect(() => {
		if (CSS.supports("animation-timeline: scroll()")) return;
		void page.url;

		scroll(
			animate([
				[".left", { scaleX: [0, 1] }, { at: 0 }],
				[".right", { scaleX: [1, 0] }, { ease: [0.42, 0, 0.58, 1], at: 0 }],
			]),
		);
	});
</script>

<div class="scroll-progress fixed inset-x-0 bottom-0 z-20 flex h-2 items-center">
	<div class="relative h-full w-1/5 bg-aloe-400"></div>

	<div class="relative h-full flex-auto">
		<div class="absolute inset-0"></div>
		<div class="left size-full origin-left bg-aloe-400"></div>
	</div>

	<div class="right absolute right-0 h-full w-1/5 origin-right bg-denim-500"></div>
</div>

<style>
	@supports (animation-timeline: scroll()) {
		:global(html) {
			animation: detect-scroll linear;
			animation-timeline: scroll(self);
		}

		.left {
			opacity: calc(1 * var(--has-scroll, 0));
			animation: grow forwards;
			animation-timeline: scroll(root y);
		}

		.right {
			animation: shrink cubic-bezier(0.42, 0, 0.58, 1) forwards;
			animation-timeline: scroll(root y);
		}

		@keyframes detect-scroll {
			from,
			to {
				--has-scroll: 1;
			}
		}

		@keyframes grow {
			from {
				transform: scaleX(0);
			}

			to {
				transform: scaleX(1);
			}
		}

		@keyframes shrink {
			from {
				transform: scaleX(1);
			}

			to {
				transform: scaleX(0);
			}
		}
	}
</style>
