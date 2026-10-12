<script lang="ts">
	import dayjs from "dayjs";
	import { logout } from "#lib/admin.remote.js";

	const { data } = $props();

	let filter = $state("");

	const filtered = $derived.by(() => {
		const query = filter.trim().toLowerCase();
		if (!query) return data.reviews;

		return data.reviews.filter((review) =>
			`${review.title} ${review.artist}`.toLowerCase().includes(query),
		);
	});
</script>

<div class="mb-8 flex items-center justify-between">
	<input
		id="search"
		class="max-w-sm"
		type="text"
		placeholder="Search reviews..."
		bind:value={filter}
	/>

	<div class="flex items-center gap-2">
		<a href="/admin/music/new" data-variant="primary">New Review</a>

		<form {...logout}>
			<button type="submit" data-variant="secondary">Sign Out</button>
		</form>
	</div>
</div>

<div class="border-y border-foreground/15">
	<table class="w-full text-left">
		<thead>
			<tr
				class="border-b border-foreground/15 *:px-2 *:py-4 *:text-sm *:font-medium *:uppercase"
			>
				<th>Title</th>
				<th>Artist</th>
				<th>Published</th>
				<th>Updated</th>
			</tr>
		</thead>

		<tbody>
			{#each filtered as review (review.id)}
				<tr
					class="group border-b border-border transition-colors *:px-2 *:py-4 last:border-none hover:bg-foreground/3"
				>
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
							<time
								class="text-sm text-muted-foreground"
								datetime={review.publishedAt.toISOString()}
							>
								{dayjs(review.publishedAt).format("MMM DD, YYYY")}
							</time>
						{:else}
							<span class="text-sm text-muted-foreground lowercase"
								>{review.status}</span
							>
						{/if}
					</td>

					<td>
						<time
							class="text-sm text-muted-foreground"
							datetime={review.updatedAt.toISOString()}
						>
							{dayjs(review.updatedAt).format("MMM DD, YYYY")}
						</time>
					</td>
				</tr>
			{:else}
				<tr>
					<td class="px-2 py-4 text-sm text-muted-foreground" colspan="4">
						No reviews yet.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
