<script lang="ts">
	const size = $state({ width: 0, height: 0 });

	let chip: HTMLElement;
</script>

<svelte:window
	onresize={() => {
		size.width = innerWidth;
		size.height = innerHeight;
	}}
	bind:innerWidth={size.width}
	bind:innerHeight={size.height}
/>

<div
	class="text-foreground fixed bottom-5 left-5 z-9999 flex items-center space-x-2 rounded-full bg-black/20 px-2.5 py-1 font-mono text-xs backdrop-blur-sm select-none dark:bg-white/30"
	bind:this={chip}
>
	<span>
		{size.width} &times; {size.height}
	</span>

	<div class="bg-foreground h-4 w-px"></div>

	<span class="sm:hidden">XS</span>
	<span class="hidden sm:inline md:hidden">SM</span>
	<span class="hidden md:inline lg:hidden">MD</span>
	<span class="hidden lg:inline xl:hidden">LG</span>
	<span class="hidden xl:inline 2xl:hidden">XL</span>
	<span class="hidden 2xl:inline">2XL</span>
</div>
