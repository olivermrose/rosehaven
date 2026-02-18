<script lang="ts">
	import { mode, toggleMode } from "mode-watcher";
	import { motion } from "motion-sv";
	import { PUBLIC_SITE_NAME } from "$env/static/public";
</script>

<motion.header
	class="fixed inset-x-0 top-0 z-50 p-6 pb-0 mix-blend-difference md:px-10"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
>
	<nav class="flex w-full items-center justify-between">
		<a class="blended" href="/">{PUBLIC_SITE_NAME}</a>

		<button class="hover:cursor-pointer" type="button" onclick={toggleMode}>
			<div class="flex h-6 flex-col items-end justify-start overflow-hidden *:blended">
				<motion.span animate={{ y: mode.current === "light" ? "0%" : "-100%" }}>light.</motion.span>
				<motion.span animate={{ y: mode.current === "light" ? "0%" : "-100%" }}>dark.</motion.span>
			</div>
		</button>
	</nav>
</motion.header>
