<script lang="ts">
	import { Image01Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { untrack } from "svelte";

	import PostDate from "#lib/components/PostDate.svelte";
	import { createReview, updateReview } from "#lib/reviews.remote.js";
	import type { Review } from "#lib/server/db/schema.js";
	import type { Album } from "#lib/server/itunes.js";
	import { formatTracklist, parseTracklist } from "#lib/tracklist.js";

	import Editor from "../Editor.svelte";
	import FormLayout from "../FormLayout.svelte";
	import { UnsavedChanges } from "../unsaved.svelte";
	import AlbumSearch from "./AlbumSearch.svelte";

	interface Props {
		form: typeof createReview | typeof updateReview;
		review?: Review & { version?: number; pending?: boolean };
		ondelete?: () => Promise<void>;
	}

	const { form, review, ondelete }: Props = $props();

	let content = $state("");
	let artworkFailed = $state(false);
	const issues = $derived(form.fields.allIssues());

	const artwork = $derived(form.fields.artwork.value());
	const trackCount = $derived(parseTracklist(form.fields.tracklist.value() ?? "").length);

	const unsaved = new UnsavedChanges(
		() => ({
			title: form.fields.title.value() ?? "",
			artist: form.fields.artist.value() ?? "",
			year: form.fields.year.value() ?? null,
			artwork: form.fields.artwork.value() ?? "",
			tracklist: form.fields.tracklist.value() ?? "",
			content,
		}),
		() => form.pending > 0,
	);

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
		void artwork;
		artworkFailed = false;
	});

	$effect(() => {
		if (!review) {
			form.fields.set({});
			untrack(() => unsaved.commit());
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

		untrack(() => unsaved.commit());
	});
</script>

<FormLayout
	{...form}
	noun="review"
	section={{ href: "/admin/music", label: "Music" }}
	heading={form.fields.title.value()}
	view={review && `/music/${review.slug}`}
	{issues}
	status={review?.status}
	version={review?.version}
	unpublished={review?.pending}
	dirty={unsaved.dirty}
	busy={form.pending > 0}
	result={form === updateReview ? updateReview.result : undefined}
	intentField={form.fields.intent}
	{ondelete}
>
	<AlbumSearch onselect={fill} />

	<header class="mt-10 grid items-start gap-8 sm:grid-cols-[minmax(0,15rem)_1fr]">
		{#if artwork && !artworkFailed}
			<img
				class="aspect-square w-full max-w-60 rounded-lg bg-muted object-cover shadow img-outline"
				src={artwork}
				alt="Artwork preview"
				onerror={() => (artworkFailed = true)}
			/>
		{:else}
			<div
				class="flex aspect-square w-full max-w-60 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-foreground/[0.025] p-6 text-center text-sm text-muted-foreground"
			>
				<HugeiconsIcon icon={Image01Icon} size={22} strokeWidth={1.5} />

				{artworkFailed
					? "Couldn't load that image"
					: "Pick an album or paste an artwork URL"}
			</div>
		{/if}

		<div class="min-w-0">
			{#if review?.publishedAt}
				<PostDate date={review.publishedAt} />
			{:else}
				<span class="text-sm font-medium text-muted-foreground">Not yet published</span>
			{/if}

			<label class="sr-only" for="title">Album</label>
			<textarea
				id="title"
				class="field-bare mt-3 field-sizing-content resize-none py-1 text-fluid-lg/tight font-semibold text-pretty"
				placeholder="Album title"
				rows="1"
				{...form.fields.title.as("text")}></textarea>

			<label class="sr-only" for="artist">Artist</label>
			<input
				id="artist"
				class="field-bare py-1 text-base text-muted-foreground focus-visible:text-foreground"
				placeholder="Artist"
				{...form.fields.artist.as("text")}
			/>

			<dl class="mt-6 divide-y divide-border border-y border-border">
				<div class="grid gap-x-6 gap-y-1 py-2 sm:grid-cols-[6rem_1fr] sm:items-center">
					<dt><label class="mb-0 text-muted-foreground" for="year">Year</label></dt>

					<dd>
						<input
							id="year"
							class="field-bare w-28! tabular-nums"
							placeholder="2026"
							{...form.fields.year.as("number")}
						/>
					</dd>
				</div>

				<div class="grid gap-x-6 gap-y-1 py-2 sm:grid-cols-[6rem_1fr] sm:items-center">
					<dt><label class="mb-0 text-muted-foreground" for="artwork">Artwork</label></dt>

					<dd>
						<input
							id="artwork"
							class="field-bare truncate"
							placeholder="https://r2.olivermrose.com/…"
							{...form.fields.artwork.as("url")}
						/>
					</dd>
				</div>
			</dl>
		</div>
	</header>

	<details class="group mt-10" open={!review}>
		<summary
			class="flex cursor-pointer list-none items-baseline justify-between gap-4 border-b border-border pb-3 select-none"
		>
			<span class="font-medium">Tracklist</span>

			<span class="text-xs text-muted-foreground tabular-nums">
				{trackCount}
				{trackCount === 1 ? "track" : "tracks"}
			</span>
		</summary>

		<div class="pt-4">
			<label class="sr-only" for="tracklist">Tracklist</label>
			<textarea
				id="tracklist"
				class="resize-y font-mono text-[0.8125rem]/6"
				placeholder="Opening Track 4:12"
				rows="8"
				{...form.fields.tracklist.as("text")}></textarea>

			<p class="mt-2 text-xs text-muted-foreground">
				One track per line, with an optional trailing duration like “Song Title 3:45”.
			</p>
		</div>
	</details>

	<div class="mt-12">
		<input {...form.fields.content.as("hidden", content)} />
		<Editor components={false} bind:content />
	</div>
</FormLayout>
