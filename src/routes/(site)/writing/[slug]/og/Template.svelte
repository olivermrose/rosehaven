<script lang="ts">
	import logo from "/favicon.svg?raw";

	const colors = [
		"#9e3340", // wine
		"#8daa5a", // aloe
		"#e49367", // peach
		"#5c86b2", // denim
		"#9b4672", // plum
	];

	interface Props {
		title: string;
		excerpt: string;
	}

	const { title, excerpt }: Props = $props();
</script>

<div class="relative flex h-full w-full flex-col bg-white">
	<div class="flex flex-col justify-between p-8">
		<div class="flex items-center">
			<div class="size-12 invert">
				{@html logo}
			</div>

			<h1 class="ml-4 text-3xl/none font-normal">oliver rose.</h1>
		</div>

		<hgroup class="flex w-full flex-col">
			<h2 class="ov mb-0 flex text-8xl/none font-bold">{title}</h2>

			<p class="flex max-w-3/4 text-4xl text-neutral-600">
				{excerpt}
			</p>
		</hgroup>
	</div>

	<div class="absolute bottom-0 flex h-4 w-full">
		{#each colors as color}
			<span class="flex h-full grow" style="background-color: {color}"></span>
		{/each}
	</div>
</div>
