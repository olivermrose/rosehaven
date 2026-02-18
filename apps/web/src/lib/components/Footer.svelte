<script lang="ts">
	import { motion } from "motion-sv";
	import type { Variants } from "motion-sv";

	const itemVariants: Variants = {
		hidden: {
			y: "-100%",
			opacity: 0,
		},
		visible: {
			y: "0%",
			opacity: 1,
			transition: {
				duration: 0.75,
			},
		},
	};

	function goToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
</script>

<motion.footer
	class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6"
	variants={{
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.15,
			},
		},
	}}
	initial="hidden"
	whileInView="visible"
	inViewOptions={{ amount: 0.8, once: true }}
>
	<div
		class="group flex items-center justify-between overflow-hidden border-t border-wine-300 pt-6 text-sm sm:px-4 dark:border-neutral-700"
	>
		<motion.p class="opacity-0" variants={itemVariants}>
			&copy; {new Date().getFullYear()} Oliver Rose
		</motion.p>

		<motion.button
			class="flex items-center gap-x-1 opacity-0"
			type="button"
			variants={itemVariants}
			onclick={goToTop}
		>
			Back to top

			<svg class="mb-1 size-4 -scale-y-100 text-aloe-400" viewBox="0 0 24 24">
				<path
					d="M1.2 8h21.6V5.5H1.2V8Zm21.6 9V8h-2.5v9h2.5Z"
					fill="currentColor"
					fill-rule="evenodd"
					clip-rule="evenodd"
				>
				</path>
			</svg>
		</motion.button>
	</div>
</motion.footer>
