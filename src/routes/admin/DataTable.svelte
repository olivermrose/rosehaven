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
	import { createTable } from "@tanstack/svelte-table";
	import type { SortingState } from "@tanstack/svelte-table";
	import type { Snippet } from "svelte";

	interface Props {
		data: T[];
		columns: Column<T>[];
		globalFilter?: string;
		empty?: string;
		row: Snippet<[T]>;
	}

	let { data, columns, globalFilter = $bindable(""), empty, row }: Props = $props();

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

	function getSortIndicator(columnId: string): string {
		const sort = sorting.find((s) => s.id === columnId);
		if (!sort) return "";

		return sort.desc ? " ↓" : " ↑";
	}
</script>

<div class="border-y border-foreground/15">
	<table class="w-full text-left">
		<thead>
			<tr class="border-b border-foreground/15">
				{#each table.getHeaderGroups() as group (group.id)}
					{#each group.headers as header (header.id)}
						<th
							class="cursor-pointer px-2 py-4 text-sm font-medium uppercase transition-opacity select-none hover:opacity-100"
							onclick={header.column.getToggleSortingHandler()}
						>
							{header.column.columnDef.header + getSortIndicator(header.column.id)}
						</th>
					{/each}
				{/each}
			</tr>
		</thead>

		<tbody>
			{#each table.getRowModel().rows as { id, original } (id)}
				<tr
					class="group border-b border-border transition-colors *:px-2 *:py-4 last:border-none hover:bg-foreground/3"
				>
					{@render row(original)}
				</tr>
			{:else}
				{#if empty}
					<tr>
						<td
							class="px-2 py-4 text-sm text-muted-foreground"
							colspan={columns.length}
						>
							{empty}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
