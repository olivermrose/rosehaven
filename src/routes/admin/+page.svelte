<script lang="ts">
	import { logout } from "$lib/admin.remote";
	import {
		createTable,
		getCoreRowModel,
		getFilteredRowModel,
		getSortedRowModel,
	} from "@tanstack/svelte-table";
	import type { ColumnDef, SortingState } from "@tanstack/svelte-table";
	import dayjs from "dayjs";

	const { data } = $props();

	type Post = (typeof data.posts)[number];

	const columns: ColumnDef<Post>[] = [
		{ accessorKey: "title", header: "Title", enableSorting: true },
		{ accessorKey: "category", header: "Category", enableSorting: true },
		{ accessorKey: "status", header: "Status", enableSorting: true },
		{ accessorKey: "updatedAt", header: "Updated", enableSorting: true },
	];

	let sorting = $state<SortingState>([]);
	let globalFilter = $state("");

	const table = createTable({
		get data() {
			return data.posts;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
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

<div class="mb-8 flex items-center justify-between">
	<input class="max-w-sm" type="text" placeholder="Search posts..." bind:value={globalFilter} />

	<div class="flex items-center gap-2">
		<a href="/admin/new" data-variant="primary">New Post</a>

		<form {...logout}>
			<button type="submit" data-variant="secondary">Sign Out</button>
		</form>
	</div>
</div>

<div class="border-y border-foreground/15">
	<table class="w-full text-left">
		<thead>
			<tr class="border-b border-foreground/15">
				{#each table.getHeaderGroups() as group}
					{#each group.headers as header}
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
			{#each table.getRowModel().rows as { original: post }}
				<tr
					class="group border-b border-foreground/10 transition-colors last:border-none hover:bg-foreground/3"
				>
					<td class="max-w-104 px-2 py-5">
						<a
							class="line-clamp-1 transition-opacity group-hover:opacity-100"
							href="/admin/{post.id}"
						>
							{post.title}
						</a>
					</td>

					<td class="px-2 py-5">
						<span class="text-sm lowercase opacity-60">
							{post.category.replaceAll("-", " ")}
						</span>
					</td>

					<td class="px-2 py-5">
						<span
							class={[
								"inline-block rounded-full px-2 py-1 text-xs uppercase",
								post.status === "published"
									? "bg-aloe-500/40 text-aloe-700 dark:text-aloe-300"
									: "bg-denim-500/40 text-denim-700 dark:text-denim-300",
							]}
						>
							{post.status}
						</span>
					</td>

					<td class="px-2 py-5">
						<time class="text-sm opacity-50" datetime={post.updatedAt.toISOString()}>
							{dayjs(post.updatedAt).format("MMM DD, YYYY")}
						</time>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
