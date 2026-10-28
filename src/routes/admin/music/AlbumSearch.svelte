<script lang="ts">
	import { AlertCircleIcon, Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
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
		if (event.key === "Escape") {
			term = "";
			return;
		}

		if (event.key !== "Enter") return;

		// Keep Enter from submitting the review form and pick the top result
		// instead
		event.preventDefault();

		const first = results?.current?.[0];
		if (first) void select(first.id);
	}
</script>

<div>
	<label for="album-search">Find album</label>

	<div class="relative">
		<HugeiconsIcon
			class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground {loading ||
			results?.loading
				? 'animate-spin'
				: ''}"
			icon={loading || results?.loading ? Loading03Icon : Search01Icon}
			size={16}
			strokeWidth={1.75}
		/>

		<input
			id="album-search"
			class="h-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
			type="search"
			autocomplete="off"
			placeholder="Search Apple Music or paste an album link"
			aria-describedby="album-search-status"
			disabled={loading}
			bind:value={term}
			{oninput}
			{onkeydown}
		/>
	</div>

	<div id="album-search-status" aria-live="polite">
		{#if loading}
			<p class="mt-2 text-sm text-muted-foreground">Loading album…</p>
		{:else if failed || results?.error}
			<p class="mt-2 flex items-center gap-1.5 text-sm text-error">
				<HugeiconsIcon icon={AlertCircleIcon} size={15} strokeWidth={1.75} />
				{failed
					? "Couldn't load that album. Check the link and try again."
					: "Search failed. Try again in a moment."}
			</p>
		{:else if results?.current}
			<ul
				class="mt-2 max-h-80 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-surface shadow-[0_8px_24px_-8px_rgb(0_0_0/0.15)]"
			>
				{#each results.current as album, i (album.id)}
					<li>
						<button
							class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
							type="button"
							onclick={() => select(album.id)}
						>
							<img
								class="size-10 shrink-0 rounded-md bg-muted img-outline"
								src={album.thumbnail}
								alt=""
								loading="lazy"
							/>

							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-medium">{album.title}</span
								>
								<span class="block truncate text-[0.8125rem] text-muted-foreground">
									{album.artist} · {album.year} · {album.trackCount} tracks
								</span>
							</span>

							{#if i === 0}
								<kbd class="max-sm:hidden">↵</kbd>
							{/if}
						</button>
					</li>
				{:else}
					<li class="px-3 py-3 text-sm text-muted-foreground">
						No albums found for “{debounced.current}”.
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
