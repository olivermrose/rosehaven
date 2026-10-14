<script lang="ts">
	import DataTable, { type Column } from "../DataTable.svelte";
	import DateCell from "../DateCell.svelte";
	import TableToolbar from "../TableToolbar.svelte";

	const { data } = $props();

	type Review = (typeof data.reviews)[number];

	const columns: Column<Review>[] = [
		{ accessorKey: "title", header: "Title", enableSorting: true },
		{ accessorKey: "artist", header: "Artist", enableSorting: true },
		{ accessorKey: "publishedAt", header: "Published", enableSorting: true },
		{ accessorKey: "updatedAt", header: "Updated", enableSorting: true },
	];

	let search = $state("");
</script>

<TableToolbar
	label="New Review"
	href="/admin/music/new"
	placeholder="Search reviews..."
	bind:search
/>

<DataTable data={data.reviews} {columns} globalFilter={search} empty="No reviews yet.">
	{#snippet row(review)}
		<td class="max-w-100">
			<a class="line-clamp-1" href="/admin/music/{review.id}">
				{review.title}
			</a>
		</td>

		<td>
			<span class="text-sm text-muted-foreground">{review.artist}</span>
		</td>

		<td>
			{#if review.publishedAt}
				<DateCell value={review.publishedAt} />
			{:else}
				<span class="text-sm text-muted-foreground lowercase">{review.status}</span>
			{/if}
		</td>

		<td>
			<DateCell value={review.updatedAt} />
		</td>
	{/snippet}
</DataTable>
