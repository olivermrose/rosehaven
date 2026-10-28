<script lang="ts">
	import { Add01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	interface Props {
		title: string;
		href?: string;
		label?: string;
	}

	const { title, href, label }: Props = $props();
</script>

<svelte:head>
	<title>{title} | admin</title>
</svelte:head>

<header class="mb-8 flex flex-wrap items-end justify-between gap-4">
	<h1 class="text-2xl font-semibold tracking-tight">
		<span class="period">{title}</span>
	</h1>

	{#if href && label}
		<a {href} data-variant="primary">
			<HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2} />
			{label}
		</a>
	{/if}
</header>
