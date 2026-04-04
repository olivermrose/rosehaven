<script lang="ts">
	import { SITE_NAME } from "$lib";
	import { mode, toggleMode } from "mode-watcher";
	import { motion } from "motion-sv";

	const y = $derived(mode.current === "light" ? "0%" : "-100%");
</script>

<motion.header
	class="fixed inset-x-0 top-0 z-50 p-6 pb-0 mix-blend-difference md:px-10"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
>
	<nav class="flex w-full items-center justify-between">
		<a class="blended" href="/">{SITE_NAME}</a>

		<button type="button" onclick={toggleMode}>
			<span class="flex h-6 flex-col items-end justify-start overflow-hidden *:blended">
				<motion.span animate={{ y }}>light.</motion.span>
				<motion.span animate={{ y }}>dark.</motion.span>
			</span>
		</button>
	</nav>
</motion.header>
