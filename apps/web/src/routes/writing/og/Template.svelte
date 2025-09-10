<script lang="ts">
	import { PUBLIC_BASE_URL } from "$env/static/public";

	interface Props {
		title: string;
		excerpt: string;
	}

	const { title, excerpt }: Props = $props();

	const colors = [
		"#9e3340", // wine
		"#8daa5a", // aloe
		"#e49367", // peach
		"#5c86b2", // denim
		"#9b4672", // plum
	];
</script>

<div class="flex h-full w-full flex-col bg-white">
	<div class="flex grow flex-col justify-between p-10">
		<div class="-mt-2 flex items-center">
			<!-- svelte-ignore a11y_missing_attribute -->
			<img class="h-14 w-14" style="filter: invert(1)" src="{PUBLIC_BASE_URL}/favicon.svg" />

			<h1 class="ml-5 text-4xl font-normal">oliver rose.</h1>
		</div>

		<div class="flex w-full flex-col">
			<h2 class="flex text-8xl font-bold">{title}</h2>

			<p style="max-width: 75%;" class="flex text-4xl font-normal leading-normal text-neutral-600">
				{excerpt}
			</p>
		</div>
	</div>

	<div class="flex h-4 w-full">
		{#each colors as color}
			<div class="flex h-full grow" style="background: {color};"></div>
		{/each}
	</div>
</div>
