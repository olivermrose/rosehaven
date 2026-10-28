<script lang="ts">
	import DataTable, { type Column } from "../DataTable.svelte";
	import DateCell from "../DateCell.svelte";
	import ListHeader from "../ListHeader.svelte";
	import { matchesStatus, statusFilters, summarize, type StatusFilter } from "../status";
	import StatusBadge from "../StatusBadge.svelte";
	import TableToolbar from "../TableToolbar.svelte";

	const { data } = $props();

	type Post = (typeof data.posts)[number];

	const columns: Column<Post>[] = [
		{ accessorKey: "title", header: "Title", enableSorting: true },
		{ accessorKey: "category", header: "Category", enableSorting: true },
		{
			id: "status",
			accessorFn: (post) => (post.pending ? "pending" : post.status),
			header: "Status",
			enableSorting: true,
		},
		{ accessorKey: "publishedAt", header: "Published", enableSorting: true },
		{ accessorKey: "updatedAt", header: "Updated", enableSorting: true },
	];

	const columnClass = {
		category: "max-md:hidden",
		publishedAt: "max-lg:hidden",
		updatedAt: "max-sm:hidden",
	};

	let search = $state("");
	let filter = $state<StatusFilter>("all");

	const rows = $derived(data.posts.filter((post) => matchesStatus(post, filter)));
</script>

<ListHeader
	title="Writing"
	summary={summarize(data.posts, "post")}
	href="/admin/writing/new"
	label="New post"
/>

<TableToolbar
	filters={statusFilters(data.posts)}
	placeholder="Search posts"
	bind:search
	bind:filter
/>

<DataTable data={rows} {columns} {columnClass} globalFilter={search}>
	{#snippet row(post)}
		<td class="w-full max-w-0">
			<div class="flex min-w-0 items-center gap-2">
				<a
					class="truncate font-medium outline-none after:absolute after:inset-0 focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-foreground/60"
					href="/admin/writing/{post.id}"
				>
					{post.title}
				</a>

				{#if post.explicit}
					<span
						class="shrink-0 rounded-sm border border-border px-1 text-[0.6875rem]/4 font-medium text-muted-foreground"
						title="Explicit"
					>
						E
					</span>
				{/if}
			</div>
		</td>

		<td class={columnClass.category}>
			<span class="text-sm whitespace-nowrap text-muted-foreground">{post.category}</span>
		</td>

		<td>
			<StatusBadge status={post.status} pending={post.pending} />
		</td>

		<td class={columnClass.publishedAt}>
			{#if post.publishedAt}
				<DateCell value={post.publishedAt} />
			{:else}
				<span class="text-sm text-muted-foreground/60">—</span>
			{/if}
		</td>

		<td class={columnClass.updatedAt}>
			<DateCell value={post.updatedAt} relative />
		</td>
	{/snippet}

	{#snippet empty()}
		{#if data.posts.length === 0}
			<p class="font-medium">Nothing written yet</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Drafts stay private until you publish them.
			</p>

			<a class="mt-5" href="/admin/writing/new" data-variant="secondary">Start a post</a>
		{:else}
			<p class="font-medium">No posts match</p>
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
