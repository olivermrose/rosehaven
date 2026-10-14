<script lang="ts">
	import type { Snippet } from "svelte";
	import { stagger } from "#lib/motion.js";
	import Link from "./Link.svelte";

	interface Props {
		class?: string;
		empty: boolean;
		heading: Snippet;
		lead: Snippet;
		children: Snippet;
	}

	const { class: className, empty, heading, lead, children }: Props = $props();
</script>

<div class="mx-auto max-w-6xl px-6 pt-28 pb-20" {@attach stagger}>
	<div class="mb-8">
		<Link href="/" back>home</Link>
	</div>

	<hgroup class="mb-12 max-w-prose">
		<h1 class="text-fluid-3xl/tight" data-stagger>
			{@render heading()}
		</h1>

		<p class="mt-2" data-stagger>
			{@render lead()}
		</p>
	</hgroup>

	<div class={className}>
		{#if !empty}
			{@render children()}
		{:else}
			<p class="border-t border-border pt-6 text-sm text-muted-foreground">
				Nothing here yet.
			</p>
		{/if}
	</div>
</div>
