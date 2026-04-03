<script lang="ts">
	import { motion, useScroll, useTransform } from "motion-sv";

	const { scrollYProgress: grow } = useScroll();
	const shrink = useTransform(grow, [0, 1], [1, 0]);
</script>

<motion.div
	id="scroll-progress"
	class="fixed inset-x-0 bottom-0 z-20 flex h-2 items-center"
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.5 }}
>
	<div class="relative h-full w-1/5 bg-aloe-400 dark:bg-off-white"></div>

	<motion.div
		class="h-full flex-auto origin-left bg-aloe-400 dark:bg-off-white"
		style={{ scaleX: grow }}
	/>

	<motion.div
		class="absolute right-0 h-full w-1/5 origin-right bg-plum-600 dark:bg-neutral-500"
		style={{ scaleX: shrink }}
	/>
</motion.div>
