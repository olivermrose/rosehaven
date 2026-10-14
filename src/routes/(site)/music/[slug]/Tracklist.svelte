<script lang="ts">
	import type { Track } from "#lib/server/db/schema.js";

	interface Props {
		tracks: Track[];
		open?: boolean;
	}

	const { tracks, open = false }: Props = $props();

	const runtime = $derived.by(() => {
		if (!tracks.length || tracks.some((track) => !track.duration)) return null;

		const seconds = tracks.reduce((total, track) => {
			const parts = track.duration!.split(":").map(Number);
			return total + parts.reduce((acc, part) => acc * 60 + part, 0);
		}, 0);

		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		return hours ? `${hours} hr ${minutes} min` : `${minutes} min`;
	});
</script>

<details class="tracklist" {open}>
	<summary
		class="flex cursor-pointer list-none items-baseline justify-between gap-4 border-b border-border pb-3 select-none"
	>
		<span class="font-medium">Tracklist</span>

		<div class="flex items-center gap-3 text-xs text-muted-foreground">
			<span class="tabular-nums">
				{tracks.length}
				{tracks.length === 1 ? "track" : "tracks"}{runtime ? ` · ${runtime}` : ""}
			</span>

			<svg
				class="chevron size-4 self-center transition-transform duration-300"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					d="m6 9 6 6 6-6"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</summary>

	<ol>
		{#each tracks as track, i (i)}
			<li class="flex items-center gap-4 border-b border-border py-3">
				<span class="w-6 shrink-0 text-xs text-muted-foreground tabular-nums">
					{String(i + 1).padStart(2, "0")}
				</span>

				<span class="min-w-0 flex-1">{track.title}</span>

				{#if track.duration}
					<span class="text-xs text-muted-foreground tabular-nums">
						{track.duration}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</details>

<style>
	.tracklist {
		interpolate-size: allow-keywords;

		&::details-content {
			block-size: 0;
			overflow: clip;
			transition:
				block-size 500ms var(--ease-out-expo),
				content-visibility 500ms allow-discrete;
		}

		&[open]::details-content {
			block-size: auto;
		}

		&[open] .chevron {
			rotate: 180deg;
		}

		summary::-webkit-details-marker {
			display: none;
		}
	}
</style>
