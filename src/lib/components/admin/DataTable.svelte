<script module lang="ts">
	import {
		tableFeatures,
		rowSortingFeature,
		globalFilteringFeature,
		columnFilteringFeature,
		createSortedRowModel,
		createFilteredRowModel,
	} from "@tanstack/svelte-table";
	import type { ColumnDef, RowData } from "@tanstack/svelte-table";

	const features = tableFeatures({
		rowSortingFeature,
		columnFilteringFeature,
		globalFilteringFeature,
		sortedRowModel: createSortedRowModel(),
		filteredRowModel: createFilteredRowModel(),
	});

	export type Column<T extends RowData> = ColumnDef<typeof features, T>;
</script>

<script lang="ts" generics="T extends RowData">
	import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { createTable } from "@tanstack/svelte-table";
	import type { SortingState } from "@tanstack/svelte-table";
	import type { Snippet } from "svelte";

	interface Props {
		data: T[];
		columns: Column<T>[];
		globalFilter?: string;
		/** Extra classes per column id, e.g. to hide a column on small screens */
		columnClass?: Record<string, string>;
		row: Snippet<[T]>;
		empty?: Snippet;
	}

	let {
		data,
		columns,
		globalFilter = $bindable(""),
		columnClass = {},
		row,
		empty,
	}: Props = $props();

	let sorting = $state<SortingState>([]);

	const table = createTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		features,
		state: {
			get sorting() {
				return sorting;
			},
			get globalFilter() {
				return globalFilter;
			},
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === "function" ? updater(sorting) : updater;
		},
		onGlobalFilterChange: (updater) => {
			globalFilter = typeof updater === "function" ? updater(globalFilter) : updater;
		},
	});

	function getSort(columnId: string) {
		const sort = sorting.find((s) => s.id === columnId);
		if (!sort) return undefined;

		return sort.desc ? "descending" : "ascending";
	}
</script>

<div class="overflow-hidden rounded-xl border border-border bg-surface">
	<table class="w-full text-left">
		<thead class="bg-foreground/[0.025]">
			{#each table.getHeaderGroups() as group (group.id)}
				<tr class="border-b border-border">
					{#each group.headers as header (header.id)}
						{@const sort = getSort(header.column.id)}

						<th
							class={[
								"h-10 px-4 text-xs font-medium whitespace-nowrap text-muted-foreground",
								columnClass[header.column.id],
							]}
							aria-sort={sort ?? "none"}
						>
							<button
								class="group/sort -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
								type="button"
								onclick={header.column.getToggleSortingHandler()}
							>
								{header.column.columnDef.header}

								<HugeiconsIcon
									class="transition-opacity {sort
										? ''
										: 'opacity-0 group-hover/sort:opacity-60'}"
									icon={sort === "ascending"
										? ArrowUp01Icon
										: sort === "descending"
											? ArrowDown01Icon
											: ArrowUpDownIcon}
									size={13}
									strokeWidth={2}
								/>
							</button>
						</th>
					{/each}
				</tr>
			{/each}
		</thead>

		<tbody>
			{#each table.getRowModel().rows as { id, original } (id)}
				<tr
					class="relative border-b border-border transition-colors *:px-4 *:py-3 last:border-none focus-within:bg-foreground/[0.035] hover:bg-foreground/[0.035]"
				>
					{@render row(original)}
				</tr>
			{:else}
				{#if empty}
					<tr>
						<td class="px-6 py-16 text-center" colspan={columns.length}>
							{@render empty()}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
