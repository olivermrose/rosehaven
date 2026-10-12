<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";

	interface Props extends HTMLAnchorAttributes {
		href: string;
		back?: boolean;
	}

	const { href, back = false, children, ...rest }: Props = $props();
</script>

<a
	class={["group inline-flex items-baseline gap-1 no-underline", back && "flex-row-reverse"]}
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
