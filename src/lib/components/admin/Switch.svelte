<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {
		label: string;
	}

	const { label, ...rest }: Props = $props();
</script>

<label class="mb-0 inline-flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
	<span class="relative inline-flex shrink-0">
		<input class="peer sr-only" {...rest} />

		<span
			class="h-5 w-9 rounded-full bg-foreground/15 transition-colors peer-checked:bg-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground/60"
		></span>

		<span
			class="absolute top-0.5 left-0.5 size-4 rounded-full bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-out-quart peer-checked:translate-x-4 peer-checked:bg-background"
		></span>
	</span>

	{label}
</label>
