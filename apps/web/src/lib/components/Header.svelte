<script lang="ts">
	import { mode, toggleMode } from "mode-watcher";
	import { animate } from "motion";
	import { onMount } from "svelte";
	import { SITE_NAME } from "$lib";

	onMount(() => {
		animate("#site-header", { opacity: 1 }, { duration: 0.75 });
	});

	$effect(() => {
		animate("#theme-btn .label", { y: mode.current === "light" ? "0%" : "-100%" });
	});
</script>

<header
	id="site-header"
	class="fixed inset-x-0 top-0 z-50 p-6 pb-0 opacity-0 mix-blend-difference md:px-10"
>
	<nav class="flex w-full items-center justify-between">
		<a class="blended" href="/">{SITE_NAME}</a>

		<button id="theme-btn" class="hover:cursor-pointer" type="button" onclick={toggleMode}>
			<div class="flex h-6 flex-col items-end justify-start overflow-hidden">
				<span class="label blended">light.</span>
				<span class="label blended">dark.</span>
			</div>
		</button>
	</nav>
</header>
