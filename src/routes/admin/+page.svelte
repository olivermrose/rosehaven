<script lang="ts">
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

	const columns: ColumnDef<Post, unknown>[] = [
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

		return sort.desc ? " \u2193" : " \u2191";
	}

	function formatCategory(cat: string) {
		return cat.replaceAll("-", " ").toUpperCase();
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="font-nd-sans text-2xl tracking-tight text-nd-bright">Posts</h1>

	<a href="/admin/new" class="nd-btn nd-btn-primary">New post</a>
</div>

<div class="mb-6">
	<input
		type="text"
		class="nd-input max-w-xs font-nd-mono text-xs placeholder:uppercase"
		placeholder="Search posts..."
		bind:value={globalFilter}
	/>
</div>

{#if data.posts.length === 0}
	<div class="py-24 text-center">
		<p class="nd-label text-nd-dim">No posts yet</p>
	</div>
{:else}
	<div class="overflow-hidden rounded-lg border border-nd-edge">
		<table class="w-full text-left">
			<thead>
				<tr class="border-b border-nd-edge-strong">
					{#each table.getHeaderGroups() as headerGroup}
						{#each headerGroup.headers as header}
							<th
								class="nd-label cursor-pointer px-4 py-3 transition-colors select-none hover:text-nd-solid"
								onclick={header.column.getToggleSortingHandler()}
							>
								{header.column.columnDef.header + getSortIndicator(header.column.id)}
							</th>
						{/each}
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each table.getRowModel().rows as row}
					{@const post = row.original}

					<tr class="border-b border-nd-edge transition-colors last:border-none hover:bg-nd-raised">
						<td class="max-w-100 px-4 py-3">
							<a
								href="/admin/{post.id}"
								class="line-clamp-1 font-nd-sans text-sm text-nd-bright transition-colors hover:text-nd-link"
							>
								{post.title}
							</a>
						</td>

						<td class="px-4 py-3">
							<span class="font-nd-mono text-xs tracking-wider text-nd-muted">
								{formatCategory(post.category)}
							</span>
						</td>

						<td class="px-4 py-3">
							<span
								class={[
									"inline-block rounded-full border px-3 py-0.5 font-nd-mono text-xs tracking-wider uppercase",
									post.status === "published"
										? "border-nd-success/40 text-nd-success"
										: "border-nd-warning/40 text-nd-warning",
								]}
							>
								{post.status}
							</span>
						</td>

						<td class="px-4 py-3">
							<time
								class="font-nd-mono text-xs text-nd-dim"
								datetime={post.updatedAt.toISOString()}
							>
								{dayjs(post.updatedAt).format("MMM DD, YYYY")}
							</time>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p class="nd-label mt-4 text-nd-dim">
		{table.getRowModel().rows.length} of {data.posts.length} posts
	</p>
{/if}
