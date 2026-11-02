<script lang="ts">
	import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { on } from "svelte/events";

	interface Props extends HTMLButtonAttributes {
		label?: string;
		menu: Snippet;
		children: Snippet;
	}

	const { label = "More actions", menu, children, ...rest }: Props = $props();

	const id = $props.id();

	const menuId = `split-${id}`;
	const anchor = `--split-${id}`;

	let open = $state(false);

	function dismiss(node: HTMLDivElement) {
		return on(node, "click", (event) => {
			if ((event.target as Element).closest('[role="menuitem"]')) {
				node.hidePopover();
			}
		});
	}
</script>

<div class="split flex" role="group">
	<button class="rounded-r-none" data-variant="primary" {...rest}>
		{@render children()}
	</button>

	<button
		class="toggle rounded-l-none border-l-background/20"
		type="button"
		data-variant="primary"
		data-size="icon"
		aria-label={label}
		aria-haspopup="menu"
		aria-expanded={open}
		popovertarget={menuId}
		style:anchor-name={anchor}
	>
		<HugeiconsIcon
			class="transition-transform duration-150 {open ? 'rotate-180' : ''}"
			icon={ArrowDown01Icon}
			size={16}
			strokeWidth={2}
		/>
	</button>

	<div
		id={menuId}
		class="fixed inset-auto m-0 min-w-52 rounded-2xl border border-border bg-surface p-1 text-sm"
		popover
		role="menu"
		style:position-anchor={anchor}
		ontoggle={(event) => (open = event.newState === "open")}
		{@attach dismiss}
	>
		{@render menu()}
	</div>
</div>

<style>
	[role="menu"] {
		box-shadow:
			0 8px 24px -6px rgb(0 0 0 / 0.18),
			0 2px 6px -2px rgb(0 0 0 / 0.08);
		margin-top: 0.375rem;
		position-area: bottom span-left;

		:global([role="menuitem"]) {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			border-radius: var(--radius-xl);
			padding: 0.4375rem 0.625rem;
			text-align: left;
			transition: background-color 150ms ease;

			&:hover:not(:disabled) {
				background-color: --alpha(var(--foreground) / 7%);
			}

			&:disabled {
				opacity: 0.5;
			}
		}

		:global([role="separator"]) {
			height: 1px;
			margin: 0.25rem -0.25rem;
			background-color: var(--color-border);
		}
	}
</style>
