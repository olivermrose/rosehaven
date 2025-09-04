<script lang="ts">
	import { innerWidth, innerHeight } from "svelte/reactivity/window";
</script>

<div
	class="text-foreground fixed bottom-5 left-5 z-9999 flex items-center space-x-2 rounded-full bg-black/20 px-2.5 py-1 font-mono text-xs backdrop-blur-sm select-none dark:bg-white/30"
>
	<span>
		{innerWidth.current} &times; {innerHeight.current}
	</span>

	<div class="bg-foreground h-4 w-px"></div>

	<span class="sm:hidden">XS</span>
	<span class="hidden sm:inline md:hidden">SM</span>
	<span class="hidden md:inline lg:hidden">MD</span>
	<span class="hidden lg:inline xl:hidden">LG</span>
	<span class="hidden xl:inline 2xl:hidden">XL</span>
	<span class="hidden 2xl:inline">2XL</span>
</div>
