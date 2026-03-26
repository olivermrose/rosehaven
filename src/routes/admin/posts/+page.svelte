<script lang="ts">
	import dayjs from "dayjs";

	const { data } = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="text-xl font-semibold">Posts</h1>
	<a
		href="/admin/posts/new"
		class="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
	>
		New post
	</a>
</div>

{#if data.posts.length === 0}
	<p class="mt-8 text-sm text-neutral-500">No posts yet.</p>
{:else}
	<div class="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-neutral-200 bg-neutral-50">
				<tr>
					<th class="px-4 py-2.5 font-medium text-neutral-600">Title</th>
					<th class="px-4 py-2.5 font-medium text-neutral-600">Category</th>
					<th class="px-4 py-2.5 font-medium text-neutral-600">Status</th>
					<th class="px-4 py-2.5 font-medium text-neutral-600">Updated</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-neutral-100">
				{#each data.posts as post}
					<tr class="transition-colors hover:bg-neutral-50">
						<td class="px-4 py-2.5">
							<a
								href="/admin/posts/{post.id}"
								class="font-medium text-neutral-900 hover:underline"
							>
								{post.title}
							</a>
						</td>
						<td class="px-4 py-2.5 text-neutral-600">{post.category}</td>
						<td class="px-4 py-2.5">
							<span
								class={[
									"inline-block rounded-full px-2 py-0.5 text-xs font-medium",
									post.status === "published"
										? "bg-emerald-50 text-emerald-700"
										: "bg-amber-50 text-amber-700",
								]}
							>
								{post.status}
							</span>
						</td>
						<td class="px-4 py-2.5 text-neutral-500">
							{dayjs(post.updatedAt).format("MMM D, YYYY")}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
