<script lang="ts">
	import type { Snippet } from "svelte";
	import { createReview, updateReview } from "#lib/reviews.remote.js";
	import type { Review } from "#lib/server/db/schema.js";
	import type { Album } from "#lib/server/itunes.js";
	import { formatTracklist, parseTracklist } from "#lib/tracklist.js";
	import Editor from "../Editor.svelte";
	import AlbumSearch from "./AlbumSearch.svelte";

	interface Props {
		form: typeof createReview | typeof updateReview;
		review?: Review;
		actions?: Snippet;
	}

	const { form, review, actions }: Props = $props();

	let content = $state("");
	const issues = $derived(form.fields.allIssues());

	const artwork = $derived(form.fields.artwork.value());
	const trackCount = $derived(parseTracklist(form.fields.tracklist.value() ?? "").length);

	function fill(album: Album) {
		form.fields.title.set(album.title);
		form.fields.artist.set(album.artist);
		form.fields.year.set(album.year);
		form.fields.artwork.set(album.artwork);
		form.fields.tracklist.set(formatTracklist(album.tracklist));
	}

	$effect(() => {
		if (!review) return;

		content = review.content;

		form.fields.set({
			title: review.title,
			artist: review.artist,
			year: review.year ?? undefined,
			artwork: review.artwork,
			tracklist: formatTracklist(review.tracklist),
			content: review.content,
		});
	});
</script>

<form class="flex items-start gap-8 max-lg:flex-col" {...form}>
	<div class="w-full min-w-0 flex-1 space-y-8">
		{#if issues}
			<div class="border-l-2 border-peach-400 bg-peach-400/5 px-5 py-3">
				<p class="mb-2 text-peach-600 dark:text-peach-300">Error</p>

				<ul class="space-y-1">
					{#each issues as issue}
						<li class="text-sm text-peach-700 dark:text-peach-200">{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<AlbumSearch onselect={fill} />

		<div class="grid gap-8 sm:grid-cols-[1fr_1fr_8rem]">
			<div>
				<label for="title">Album</label>
				<input id="title" placeholder="Album title" {...form.fields.title.as("text")} />
			</div>

			<div>
				<label for="artist">Artist</label>
				<input id="artist" placeholder="Artist" {...form.fields.artist.as("text")} />
			</div>

			<div>
				<label for="year">Year</label>
				<input id="year" placeholder="2026" {...form.fields.year.as("number")} />
			</div>
		</div>

		<div class="flex items-start gap-8">
			<div class="grow">
				<label for="artwork">Artwork URL</label>
				<input
					id="artwork"
					placeholder="https://r2.olivermrose.com/..."
					{...form.fields.artwork.as("url")}
				/>
			</div>

			{#if artwork}
				<img
					class="mt-4 aspect-square w-full max-w-xs rounded-xl object-cover outline -outline-offset-1 outline-black/10 dark:outline-white/10"
					src={artwork}
					alt="Artwork preview"
				/>
			{/if}
		</div>

		<div>
			<label class="flex items-center" for="tracklist">
				Tracklist
				<span class="ml-1.5 text-muted-foreground normal-case">
					· one per line, optional trailing duration (e.g. "Song Title 3:45") ·
					{trackCount}
					{trackCount === 1 ? "track" : "tracks"}
				</span>
			</label>

			<textarea
				id="tracklist"
				class="resize-y font-mono text-sm"
				placeholder="Opening Track 4:12"
				rows="8"
				{...form.fields.tracklist.as("text")}></textarea>
		</div>

		<div>
			<input {...form.fields.content.as("hidden", content)} />
			<Editor components={false} bind:content />
		</div>
	</div>

	<aside
		class={[
			"rounded-2xl border border-border p-6 lg:*:not-last:pb-6",
			"max-lg:grid max-lg:w-full max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-6",
			"lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:space-y-6 lg:divide-y lg:divide-border",
		]}
	>
		<div class="max-lg:col-span-2">
			<span class="mb-2 block">Status</span>

			<div
				class={[
					"inline-block rounded-full px-2 py-1 text-xs uppercase",
					review?.status === "published"
						? "bg-aloe-500/40 text-aloe-700 dark:text-aloe-300"
						: "bg-denim-500/40 text-denim-700 dark:text-denim-300",
				]}
			>
				{review?.status ?? "draft"}
			</div>
		</div>

		<div
			class="flex flex-col gap-2 max-lg:col-span-2 max-sm:flex-col sm:max-lg:flex-row lg:flex-col"
		>
			<button
				class="w-full"
				data-variant="secondary"
				{...form.fields.status.as("submit", "draft")}
			>
				Save Draft
			</button>

			<button
				class="w-full"
				data-variant="primary"
				{...form.fields.status.as("submit", "published")}
			>
				{review?.status === "published" ? "Update" : "Publish"}
			</button>
		</div>

		{#if actions}
			<div class="max-lg:col-span-2">
				{@render actions()}
			</div>
		{/if}
	</aside>
</form>
