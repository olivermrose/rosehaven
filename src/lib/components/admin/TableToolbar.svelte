<script lang="ts">
	import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	import type { StatusFilter } from "./status";

	interface Props {
		search: string;
		filter: StatusFilter;
		filters: { value: StatusFilter; label: string; count: number }[];
		placeholder: string;
	}

	let { search = $bindable(), filter = $bindable(), filters, placeholder }: Props = $props();

	let input = $state<HTMLInputElement>();

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
		if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select"))
			return;

		event.preventDefault();
		input?.focus();
	}
</script>

<svelte:window {onkeydown} />

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div
		class="inline-flex max-w-full overflow-x-auto rounded-lg bg-foreground/6 p-0.5"
		role="radiogroup"
		aria-label="Filter by status"
	>
		{#each filters as option (option.value)}
			<button
				class={[
					"inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors",
					filter === option.value
						? "bg-surface text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--color-border)]"
						: "text-muted-foreground hover:text-foreground",
				]}
				type="button"
				role="radio"
				aria-checked={filter === option.value}
				onclick={() => (filter = option.value)}
			>
				{option.label}

				<span
					class={[
						"text-xs tabular-nums",
						filter === option.value ? "text-muted-foreground" : "opacity-60",
					]}
				>
					{option.count}
				</span>
			</button>
		{/each}
	</div>

	<div class="relative w-full sm:w-72">
		<HugeiconsIcon
			class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
			icon={Search01Icon}
			size={16}
			strokeWidth={1.75}
		/>

		<label class="sr-only" for="search">Search</label>

		<input
			id="search"
			class="h-8 py-0 pr-9 pl-8 [&::-webkit-search-cancel-button]:hidden"
			type="search"
			autocomplete="off"
			{placeholder}
			bind:this={input}
			bind:value={search}
		/>

		<div class="absolute top-1/2 right-1.5 -translate-y-1/2">
			{#if search}
				<button
					class="h-6! w-6!"
					type="button"
					data-variant="ghost"
					data-size="icon-sm"
					aria-label="Clear search"
					onclick={() => {
						search = "";
						input?.focus();
					}}
				>
					<HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
				</button>
			{:else}
				<kbd class="pointer-events-none max-sm:hidden">/</kbd>
			{/if}
		</div>
	</div>
</div>
