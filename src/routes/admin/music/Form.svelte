<script lang="ts">
	import type { Snippet } from "svelte";

	import { createReview, updateReview } from "#lib/reviews.remote.js";
	import type { Review } from "#lib/server/db/schema.js";
	import type { Album } from "#lib/server/itunes.js";
	import { formatTracklist, parseTracklist } from "#lib/tracklist.js";

	import Editor from "../Editor.svelte";
	import FormLayout from "../FormLayout.svelte";
	import AlbumSearch from "./AlbumSearch.svelte";

	interface Props {
		form: typeof createReview | typeof updateReview;
		review?: Review & { version?: number; pending?: boolean };
		actions?: Snippet;
	}

	const { form, review, actions }: Props = $props();

	let content = $state("");
	const issues = $derived(form.fields.allIssues());

	const artwork = $derived(form.fields.artwork.value());
	const trackCount = $derived(parseTracklist(form.fields.tracklist.value() ?? "").length);

	function fill(album: Album) {
		form.fields.set({
			title: album.title,
			artist: album.artist,
			year: album.year,
			artwork: album.artwork,
			tracklist: formatTracklist(album.tracklist),
		});
	}

	$effect(() => {
		if (!review) {
			form.fields.set({});
			return;
		}

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

<FormLayout
	{...form}
	{issues}
	status={review?.status}
	version={review?.version}
	pending={review?.pending}
	intentField={form.fields.intent}
	{actions}
>
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
				class="mt-4 aspect-square w-full max-w-xs rounded-xl object-cover img-outline"
				src={artwork}
				alt="Artwork preview"
			/>
		{:else}
			<div
				class="mt-4 flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
			>
				No artwork
			</div>
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
</FormLayout>
