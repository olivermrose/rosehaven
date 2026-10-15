<script lang="ts">
	import { Debounced } from "runed";

	import { findAlbums, getAlbum } from "#lib/reviews.remote.js";
	import type { Album } from "#lib/server/itunes.js";

	interface Props {
		onselect: (album: Album) => void;
	}

	const { onselect }: Props = $props();

	let term = $state("");
	let loading = $state(false);
	let failed = $state(false);

	const debounced = new Debounced(() => term.trim(), 300);

	const results = $derived(
		debounced.current.length >= 2 && !parseAlbumLink(debounced.current)
			? findAlbums(debounced.current)
			: null,
	);

	function parseAlbumLink(value: string) {
		const match = /music\.apple\.com\/([a-z]{2})\/album\/(?:[^/]+\/)?(\d+)/.exec(value);
		return match ? { country: match[1], id: Number(match[2]) } : null;
	}

	async function select(id: number, country?: string) {
		loading = true;
		failed = false;

		try {
			onselect(await getAlbum({ id, country }));
			term = "";
		} catch {
			failed = true;
		} finally {
			loading = false;
		}
	}

	function oninput() {
		const link = parseAlbumLink(term);
		if (link) void select(link.id, link.country);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "Enter") return;

		// Keep Enter from submitting the review form and pick the top result
		// instead
		event.preventDefault();

		const first = results?.current?.[0];
		if (first) void select(first.id);
	}
</script>

<div>
	<label class="flex items-center" for="album-search">
		Find album
		<span class="ml-1.5 text-muted-foreground normal-case">
			· search Apple Music or paste an album link
		</span>
	</label>

	<input
		id="album-search"
		type="search"
		autocomplete="off"
		placeholder="In Rainbows Radiohead"
		disabled={loading}
		bind:value={term}
		{oninput}
		{onkeydown}
	/>

	{#if loading}
		<p class="mt-3 text-sm text-muted-foreground">Loading album…</p>
	{:else if failed}
		<p class="mt-3 text-sm text-peach-600 dark:text-peach-300">Couldn't load that album.</p>
	{:else if results?.error}
		<p class="mt-3 text-sm text-peach-600 dark:text-peach-300">Search failed. Try again.</p>
	{:else if results?.current}
		<ul class="mt-3 divide-y divide-border rounded-xl border border-border">
			{#each results.current as album (album.id)}
				<li>
					<button
						class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-foreground/5"
						type="button"
						onclick={() => select(album.id)}
					>
						<img
							class="size-10 shrink-0 rounded-md img-outline"
							src={album.thumbnail}
							alt=""
							loading="lazy"
						/>

						<span class="min-w-0">
							<span class="block truncate">{album.title}</span>
							<span class="block truncate text-sm text-muted-foreground">
								{album.artist} · {album.year} · {album.trackCount} tracks
							</span>
						</span>
					</button>
				</li>
			{:else}
				<li class="px-3 py-2 text-sm text-muted-foreground">No albums found.</li>
			{/each}
		</ul>
	{/if}
</div>
