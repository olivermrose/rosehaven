<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		as?: "h1" | "h2" | "h3";
		listing?: boolean;
	}

	const { class: className, as = "h1", listing = false, children, ...rest }: Props = $props();
</script>

<svelte:element
	this={as}
	class={[
		listing
			? "truncate font-medium transition-colors duration-300 group-hover:text-plum-500 dark:group-hover:text-white"
			: "mt-4 w-fit font-semibold text-pretty",
		className,
	]}
	{...rest}
>
	{@render children?.()}
</svelte:element>
