<script lang="ts">
	import dayjs from "dayjs";

	interface Props {
		date: Date | null;
		listing?: boolean;
	}

	const { date, listing = false }: Props = $props();
</script>

{#if date}
	<time
		class={listing
			? "shrink-0 text-xs text-muted-foreground tabular-nums group-hover:text-foreground"
			: "font-medium text-denim-500 dark:text-neutral-300"}
		datetime={date.toISOString()}
	>
		{dayjs(date).format(listing ? "MMM YYYY" : "MMMM D, YYYY")}
	</time>
{/if}
