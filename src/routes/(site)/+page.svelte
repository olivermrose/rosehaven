<script lang="ts">
	import Link from "#lib/components/Link.svelte";
	import Petals from "#lib/components/Petals.svelte";
	import Quote from "#lib/components/Quote.svelte";
	import { stagger } from "#lib/motion.js";

	const { data } = $props();
</script>

<div class="mx-auto flex min-h-dvh flex-col p-4" {@attach stagger}>
	<section id="home" class="mx-auto flex max-w-3xl flex-1 items-center">
		<div class="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
			<img
				class="aspect-3/4 w-48 shrink-0 rounded-2xl object-cover img-outline"
				src="https://assets.olivermrose.com/self.jpg"
				alt="Portrait of Oliver Rose"
				width="160"
				height="213"
				data-stagger
			/>

			<div class="max-w-prose space-y-4">
				<h1 class="text-fluid-lg font-semibold" data-stagger>oliver rose.</h1>

				{#if data.quote}
					<Quote quote={data.quote} />
				{/if}

				<p data-stagger>
					I'm a front-end engineer with full-stack experience, currently working at
					Moncur. I enjoy building web applications, exploring new technologies, and
					expressing myself through creative writing.
				</p>

				<nav class="mt-8 flex gap-6" aria-label="Sections" data-stagger>
					<Link href="/writing">writing</Link>
					<Link href="/music">music</Link>
				</nav>
			</div>
		</div>
	</section>
</div>

<Petals />
