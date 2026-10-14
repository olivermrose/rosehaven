<script lang="ts">
	import Link from "#lib/components/Link.svelte";

	interface Props {
		back: string;
		view: string;
		published: boolean;
	}

	const { back, view, published }: Props = $props();
</script>

<nav class="mb-8 flex items-center justify-between text-sm" aria-label="Actions">
	<Link href={back} back>all</Link>

	{#if published}
		<Link href={view} target="_blank">view</Link>
	{/if}
</nav>
