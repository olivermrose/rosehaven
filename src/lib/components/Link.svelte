<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";

	interface Props extends HTMLAnchorAttributes {
		href: string;
		back?: boolean;
	}

	const { class: className, href, back = false, children, ...rest }: Props = $props();
</script>

<a
	class={[
		"group inline-flex items-baseline gap-1.5 no-underline",
		back && "flex-row-reverse",
		className,
	]}
	{href}
	{...rest}
>
	{@render children?.()}

	<span
		class={[
			"inline-block transition-transform",
			back ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1",
		]}
	>
		--&gt;
	</span>
</a>
