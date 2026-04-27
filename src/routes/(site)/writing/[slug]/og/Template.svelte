<script lang="ts">
	import { BASE_URL } from "$lib";

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
	<div class="flex flex-col justify-between p-10">
		<div class="-mt-2 flex items-center">
			<!-- svelte-ignore a11y_missing_attribute -->
			<img class="size-14 invert" src="{BASE_URL}/favicon.svg" />

			<h1 class="ml-4 text-4xl font-normal">oliver rose.</h1>
		</div>

		<hgroup class="flex w-full flex-col">
			<h2 class="mb-0 flex text-8xl/none font-bold">{title}</h2>

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
