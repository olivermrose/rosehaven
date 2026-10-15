<script lang="ts">
	import type { Quote } from "#lib/server/db/schema.js";

	interface Props {
		quote: Quote;
	}

	const { quote }: Props = $props();
</script>

<figure class="py-2" data-stagger>
	<blockquote class="border-l-2 border-l-muted pl-3 whitespace-pre-wrap" cite={quote.sourceUrl}>
		<p class="text-muted-foreground">{quote.text}</p>
	</blockquote>

	<figcaption class="mt-2 text-sm">
		<span>
			&mdash; {quote.quotee + (quote.sourceTitle ? ", " : "")}
		</span>

		{#if quote.sourceTitle}
			<cite>
				{#if quote.sourceUrl}
					<a class="underline" href={quote.sourceUrl}>
						{quote.sourceTitle}
					</a>
				{:else}
					{quote.sourceTitle}
				{/if}
			</cite>
		{/if}
	</figcaption>
</figure>
