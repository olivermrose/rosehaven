<script lang="ts">
	import Ombre from "#lib/components/Ombre.svelte";
	import { extractPaletteFromUrl } from "#lib/palette.js";
	import type { Review } from "#lib/server/db/schema.js";

	interface Props {
		review: Review;
	}

	const { review }: Props = $props();
</script>

<div class="relative w-full md:max-w-md">
	{const palette = $derived(await extractPaletteFromUrl(review.artwork))}

	{#if palette}
		<div class="absolute inset-0 -z-10 overflow-hidden rounded-xl sm:rounded-2xl">
			<Ombre vibrant={palette.vibrant} muted={palette.muted} />

			<div class="pointer-events-none absolute inset-0 rounded-[inherit] cutout"></div>
		</div>
	{/if}

	<figure class="p-4">
		<img
			class="aspect-square w-full rounded-lg object-cover shadow outline -outline-offset-1 outline-black/10 dark:outline-white/10"
			src={review.artwork}
			alt="Album artwork for {review.title} by {review.artist}"
			fetchpriority="high"
		/>
	</figure>
</div>
