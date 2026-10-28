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
	class="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/65 transition-colors hover:bg-foreground/8 hover:text-foreground"
	type="button"
	popovertarget={menuId}
	aria-label="Insert component"
	title="Insert component"
	style:anchor-name={anchor}
>
	<HugeiconsIcon icon={PuzzleIcon} size={17} strokeWidth={1.75} />
</button>

<div
	id={menuId}
	class="m-0 mt-1.5 min-w-44 rounded-lg border border-border bg-surface p-1 shadow-[0_8px_24px_-6px_rgb(0_0_0/0.18),0_2px_6px_-2px_rgb(0_0_0/0.08)]"
	popover
	role="menu"
	style:position-anchor={anchor}
	bind:this={menu}
>
	<p class="px-2.5 pt-1.5 pb-1 text-xs text-muted-foreground">Insert component</p>

	<ul>
		{#each names as name (name)}
			<li>
				<button
					class="block w-full rounded-md px-2.5 py-1.5 text-left font-mono text-xs transition-colors hover:bg-foreground/7"
					type="button"
					role="menuitem"
					onclick={() => select(name)}
				>
					&lt;{name} /&gt;
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	[role="menu"] {
		position: fixed;
		inset: auto;
		position-area: bottom span-right;
	}
</style>
