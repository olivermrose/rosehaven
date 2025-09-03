<script lang="ts">
	import { mode, toggleMode } from "mode-watcher";
	import { animate } from "motion";
	import { onMount } from "svelte";

	onMount(() => {
		animate("#site-header", { opacity: 1 }, { duration: 0.75 });
	});

	$effect(() => {
		animate("#theme-btn .label", { y: mode.current === "light" ? "0%" : "-100%" });
	});
</script>

<header
	id="site-header"
	class="fixed inset-x-0 top-0 z-50 p-6 pb-0 text-off-black opacity-0 md:px-10 dark:text-off-white"
>
	<nav class="flex w-full items-center justify-between">
		<a href="/">oliver rose.</a>

		<button id="theme-btn" class="hover:cursor-pointer" type="button" onclick={toggleMode}>
			<div class="flex h-6 flex-col items-end justify-start overflow-hidden">
				<span class="label">light.</span>
				<span class="label">dark.</span>
			</div>
		</button>
	</nav>
</header>
