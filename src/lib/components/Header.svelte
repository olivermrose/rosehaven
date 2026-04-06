<script lang="ts">
	import { SITE_NAME } from "$lib";
	import { mode, toggleMode } from "mode-watcher";
	import { motion } from "motion-sv";
	import { page } from "$app/state";

	let toggle = $state<HTMLButtonElement>();

	const y = $derived(mode.current === "light" ? "0%" : "-100%");

	async function transitionMode() {
		if (!toggle) {
			return toggleMode();
		}

		document.documentElement.classList.add("transitioning");

		const transition = document.startViewTransition(() => {
			toggleMode();
		});

		transition.finished.finally(() => {
			document.documentElement.classList.remove("transitioning");
		});

		await transition.ready;

		const rect = toggle.getBoundingClientRect();

		const x = rect.left + rect.width / 2;
		// oxlint-disable-next-line no-shadow
		const y = rect.top + rect.height / 2;

		const right = window.innerWidth - rect.left;
		const bottom = window.innerHeight - rect.top;

		const maxRadius = Math.hypot(Math.max(rect.left, right), Math.max(rect.top, bottom));

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
			},
			{
				duration: 500,
				easing: "ease",
				pseudoElement: "::view-transition-new(root)",
			},
		);
	}
</script>

<motion.header
	class="fixed inset-x-0 top-0 z-50 p-6 pb-0 mix-blend-difference md:px-10"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
>
	<nav class="flex w-full items-center justify-between">
		<a class="blended" href="/">{SITE_NAME}</a>

		<div class="space-x-4">
			{#if page.data.authenticated}
				<a class="blended hover:underline" href="/admin">admin.</a>
			{/if}

			<button type="button" onclick={transitionMode} bind:this={toggle}>
				<span class="flex h-6 flex-col items-end justify-start overflow-hidden *:blended">
					<motion.span animate={{ y }}>light.</motion.span>
					<motion.span animate={{ y }}>dark.</motion.span>
				</span>
			</button>
		</div>
	</nav>
</motion.header>
