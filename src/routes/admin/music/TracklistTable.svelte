<script lang="ts">
	import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { tick } from "svelte";

	import type { Track } from "#lib/server/db/schema.js";
	import { RATING_MAX } from "#lib/tracklist.js";

	interface Props {
		tracks: Track[];
	}

	let { tracks = $bindable() }: Props = $props();

	let table = $state<HTMLTableElement>();

	const showBlank = $derived(tracks.length === 0 || isFilled(tracks[tracks.length - 1]));
	const rows = $derived(showBlank ? [...tracks, { title: "" }] : tracks);

	function isFilled(track: Track) {
		return (
			track.title.trim() !== "" ||
			(track.duration ?? "").trim() !== "" ||
			track.rating !== undefined
		);
	}

	function update(index: number, patch: Partial<Track>) {
		if (index === tracks.length) {
			tracks.push({ title: "", ...patch });
		} else {
			Object.assign(tracks[index], patch);
		}
	}

	async function add(index: number) {
		tracks.splice(index + 1, 0, { title: "" });

		await tick();
		table?.querySelectorAll<HTMLInputElement>("input[data-track-title]")[index + 1]?.focus();
	}

	function remove(index: number) {
		tracks.splice(index, 1);
	}
</script>

<table class="w-full border-collapse text-sm" bind:this={table}>
	<thead class="sr-only">
		<tr>
			<th scope="col">Title</th>
			<th scope="col">Duration</th>
			<th scope="col">Rating</th>
			<th scope="col">Actions</th>
		</tr>
	</thead>

	<tbody>
		{#each rows as track, index}
			{const blank = $derived(index === tracks.length)}

			<tr class="group border-border not-last:border-b">
				<td class="border-r border-border p-0">
					<input
						class="rounded-none border-0 bg-transparent px-3 py-2 focus-visible:shadow-none"
						value={track.title}
						placeholder={index === 0 ? "Track title" : ""}
						aria-label="Track {index + 1} title"
						data-track-title
						oninput={(event) => update(index, { title: event.currentTarget.value })}
					/>
				</td>

				<td class="w-20 border-r border-border p-0">
					<input
						class="rounded-none border-0 bg-transparent px-3 py-2 text-center font-mono text-[0.8125rem] tabular-nums focus-visible:shadow-none"
						value={track.duration ?? ""}
						placeholder={index === 0 ? "3:45" : ""}
						aria-label="Track {index + 1} duration"
						oninput={(event) => update(index, { duration: event.currentTarget.value })}
					/>
				</td>

				<td class="w-16 p-0">
					<input
						class="[appearance:textfield] rounded-none border-0 bg-transparent px-3 py-2 text-center font-mono text-[0.8125rem] tabular-nums focus-visible:shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						type="number"
						inputmode="numeric"
						min="1"
						max={RATING_MAX}
						step="1"
						value={track.rating ?? ""}
						placeholder={index === 0 ? "4" : ""}
						aria-label="Track {index + 1} rating out of {RATING_MAX}"
						oninput={(event) => {
							const rating = event.currentTarget.valueAsNumber;
							update(index, { rating: Number.isNaN(rating) ? undefined : rating });
						}}
					/>
				</td>

				<td class="w-px p-0 whitespace-nowrap">
					<div
						class="flex gap-0.5 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 pointer-fine:opacity-0"
					>
						<button
							title="Add track below"
							type="button"
							disabled={blank}
							aria-label="Add track below track {index + 1}"
							data-variant="ghost"
							data-size="icon-sm"
							onclick={() => add(index)}
						>
							<HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.75} />
						</button>

						<button
							title="Delete track"
							type="button"
							disabled={blank}
							aria-label="Delete track {index + 1}"
							data-variant="destructive"
							data-size="icon-sm"
							onclick={() => remove(index)}
						>
							<HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.75} />
						</button>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
