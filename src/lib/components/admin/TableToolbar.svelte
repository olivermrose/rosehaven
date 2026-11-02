<script lang="ts">
	import { Add01Icon, Search01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	import type { StatusFilter } from "#lib/status.js";

	interface Filter {
		value: StatusFilter;
		label: string;
		count: number;
	}

	interface Props {
		search: string;
		filter: StatusFilter;
		filters: Filter[];
		placeholder: string;
		action?: { href: string; label: string };
	}

	let {
		search = $bindable(),
		filter = $bindable(),
		filters,
		placeholder,
		action,
	}: Props = $props();
</script>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
	<div
		class="inline-flex max-w-full overflow-x-auto rounded-xl bg-foreground/6 p-1"
		role="radiogroup"
		aria-label="Filter by status"
	>
		{#each filters as option (option.value)}
			<button
				class={[
					"inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors",
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

	<div class="flex w-full items-center gap-2 sm:w-auto">
		<div class="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
			<HugeiconsIcon
				class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
				icon={Search01Icon}
				size={16}
				strokeWidth={1.75}
			/>

			<label class="sr-only" for="search">Search</label>

			<input
				id="search"
				class="h-8 py-0 pr-1 pl-8"
				type="search"
				autocomplete="off"
				{placeholder}
				bind:value={search}
			/>
		</div>

		{#if action}
			<a class="shrink-0" href={action.href} data-variant="primary">
				<HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={2} />
				{action.label}
			</a>
		{/if}
	</div>
</div>
