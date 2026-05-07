<script lang="ts">
	import { motion } from "motion-sv";
	import { page } from "$app/state";

	const message = $derived(page.error?.message ?? "Something went wrong");
</script>

<section
	class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
>
	<motion.span
		class="font-mono text-fluid-xs uppercase opacity-60"
		initial={{ opacity: 0, y: 8 }}
		animate={{ opacity: 0.6, y: 0 }}
		transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
	>
		Error
	</motion.span>

	<motion.h1
		class="text-[28vw] leading-none	font-light tracking-tighter sm:text-[20vw]"
		initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
		animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
		transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
	>
		{page.status}
	</motion.h1>

	<motion.div
		class="mt-2 h-px w-24 origin-center bg-current opacity-30"
		initial={{ scaleX: 0 }}
		animate={{ scaleX: 1 }}
		transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
	></motion.div>

	<motion.p
		class="mt-6 max-w-md font-serif text-fluid-md font-light italic opacity-80"
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 0.8, y: 0 }}
		transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
	>
		{message}
	</motion.p>

	<motion.a
		class="mt-12 text-fluid-xs uppercase"
		href="/"
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
	>
		Return home --&gt;
	</motion.a>
</section>
