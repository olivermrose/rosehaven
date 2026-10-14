<script lang="ts">
	import { page } from "$app/state";

	import Link from "./Link.svelte";

	interface Props {
		back: string;
		edit: string;
	}

	const { back, edit }: Props = $props();
</script>

<nav class="mb-8 flex items-center justify-between text-sm" aria-label="Actions">
	<Link href={back} back>all</Link>

	{#if page.data.authenticated}
		<Link href={edit}>edit</Link>
	{/if}
</nav>
