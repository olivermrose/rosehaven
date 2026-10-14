<script lang="ts">
	import DataTable, { type Column } from "../DataTable.svelte";
	import DateCell from "../DateCell.svelte";
	import TableToolbar from "../TableToolbar.svelte";

	const { data } = $props();

	type Post = (typeof data.posts)[number];

	const columns: Column<Post>[] = [
		{ accessorKey: "title", header: "Title", enableSorting: true },
		{ accessorKey: "category", header: "Category", enableSorting: true },
		{ accessorKey: "publishedAt", header: "Published", enableSorting: true },
		{ accessorKey: "updatedAt", header: "Updated", enableSorting: true },
	];

	let search = $state("");
</script>

<TableToolbar
	label="New Post"
	href="/admin/writing/new"
	placeholder="Search posts..."
	bind:search
/>

<DataTable data={data.posts} {columns} globalFilter={search}>
	{#snippet row(post)}
		<td class="max-w-100">
			<a
				class="line-clamp-1 transition-opacity group-hover:opacity-100"
				href="/admin/writing/{post.id}"
			>
				{post.title}
			</a>
		</td>

		<td>
			<span class="text-sm text-muted-foreground lowercase">
				{post.category}
			</span>
		</td>

		<td>
			{#if post.publishedAt}
				<DateCell value={post.publishedAt} />
			{/if}
		</td>

		<td>
			<DateCell value={post.updatedAt} />
		</td>
	{/snippet}
</DataTable>
