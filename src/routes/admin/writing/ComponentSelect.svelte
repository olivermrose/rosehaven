<script lang="ts">
	import { PuzzleIcon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	interface Props {
		names: string[];
		onselect: (name: string) => void;
	}

	const { names, onselect }: Props = $props();
	const id = $props.id();

	const menuId = `component-menu-${id}`;
	const anchor = `--component-anchor-${id}`;

	let menu = $state<HTMLDivElement>();

	function select(name: string) {
		onselect(name);
		menu?.hidePopover();
	}
</script>

<button
	class="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-foreground/10"
	type="button"
	popovertarget={menuId}
	aria-label="Insert component"
	style:anchor-name={anchor}
>
	<HugeiconsIcon icon={PuzzleIcon} size={18} strokeWidth={1.5} />
</button>

<div
	id={menuId}
	class="fixed m-0 mt-1 min-w-40 overflow-hidden rounded-lg border border-border bg-background p-0 shadow-lg"
	popover
	role="menu"
	style:position-anchor={anchor}
	bind:this={menu}
>
	<ul>
		{#each names as name}
			<li>
				<button
					class="block w-full px-3 py-2 text-left font-mono text-xs hover:bg-foreground/10"
					type="button"
					role="menuitem"
					onclick={() => select(name)}
				>
					{name}
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	[role="menu"] {
		position-area: bottom span-right;
	}
</style>
