<script lang="ts">
	import type { Quote } from "#lib/server/db/schema.js";

	interface Props {
		quote: Quote;
	}

	const { quote }: Props = $props();
</script>

<figure class="py-2" data-stagger>
	<blockquote class="border-l-2 border-l-muted pl-3 whitespace-pre-wrap" cite={quote.sourceUrl}>
		<p>{quote.text}</p>
	</blockquote>

	<figcaption class="mt-2 text-sm text-muted-foreground">
		<span>
			&mdash; {quote.quotee},
		</span>

		<cite>
			{#if quote.sourceUrl}
				<a class="underline" href={quote.sourceUrl}>
					{quote.sourceTitle}
				</a>
			{:else}
				{quote.sourceTitle}
			{/if}
		</cite>
	</figcaption>
</figure>
