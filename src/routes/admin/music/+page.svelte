<script lang="ts">
	import { artworkAt } from "#lib";
	import DataTable, { type Column } from "#lib/components/admin/DataTable.svelte";
	import DateCell from "#lib/components/admin/DateCell.svelte";
	import ListHeader from "#lib/components/admin/ListHeader.svelte";
	import StatusBadge from "#lib/components/admin/StatusBadge.svelte";
	import TableToolbar from "#lib/components/admin/TableToolbar.svelte";
	import { matchesStatus, statusFilters, type StatusFilter } from "#lib/status.js";

	const { data } = $props();

	type Review = (typeof data.reviews)[number];

	const columns: Column<Review>[] = [
		{ accessorKey: "title", header: "Album", enableSorting: true },
		{ accessorKey: "artist", header: "Artist", enableSorting: true },
		{
			id: "status",
			accessorFn: (review) => (review.pending ? "pending" : review.status),
			header: "Status",
			enableSorting: true,
		},
		{ accessorKey: "publishedAt", header: "Published", enableSorting: true },
		{ accessorKey: "updatedAt", header: "Updated", enableSorting: true },
	];

	const columnClass = {
		artist: "max-md:hidden",
		publishedAt: "max-lg:hidden",
		updatedAt: "max-sm:hidden",
	};

	let search = $state("");
	let filter = $state<StatusFilter>("all");

	const rows = $derived(data.reviews.filter((review) => matchesStatus(review, filter)));
</script>

<ListHeader title="Music" href="/admin/music/new" label="New review" />

<TableToolbar
	filters={statusFilters(data.reviews)}
	placeholder="Search albums or artists"
	bind:search
	bind:filter
/>

<DataTable data={rows} {columns} {columnClass} globalFilter={search}>
	{#snippet row(review)}
		<td class="w-full max-w-0">
			<div class="flex min-w-0 items-center gap-3">
				<img
					class="size-9 shrink-0 rounded-md bg-muted object-cover img-outline"
					src={artworkAt(review.artwork, 100)}
					alt=""
					loading="lazy"
				/>

				<div class="min-w-0">
					<a
						class="block truncate font-medium outline-none after:absolute after:inset-0 focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-foreground/60"
						href="/admin/music/{review.id}"
					>
						{review.title}
					</a>

					<span class="block truncate text-sm text-muted-foreground md:hidden">
						{review.artist}
					</span>
				</div>
			</div>
		</td>

		<td class={columnClass.artist}>
			<span class="text-sm whitespace-nowrap text-muted-foreground">
				{review.artist}{review.year ? ` · ${review.year}` : ""}
			</span>
		</td>

		<td>
			<StatusBadge status={review.status} pending={review.pending} />
		</td>

		<td class={columnClass.publishedAt}>
			{#if review.publishedAt}
				<DateCell value={review.publishedAt} />
			{:else}
				<span class="text-sm text-muted-foreground/60">—</span>
			{/if}
		</td>

		<td class={columnClass.updatedAt}>
			<DateCell value={review.updatedAt} relative />
		</td>
	{/snippet}

	{#snippet empty()}
		{#if data.reviews.length === 0}
			<p class="font-medium">No reviews yet</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Search Apple Music from a new review to fill in the album details.
			</p>

			<a class="mt-5" href="/admin/music/new" data-variant="secondary">Write a review</a>
		{:else}
			<p class="font-medium">No reviews match</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Try a different search or status filter.
			</p>

			<button
				class="mt-5"
				type="button"
				data-variant="secondary"
				onclick={() => {
					search = "";
					filter = "all";
				}}
			>
				Clear filters
			</button>
		{/if}
	{/snippet}
</DataTable>
