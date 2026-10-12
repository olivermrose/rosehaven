<script lang="ts">
	import { animate, stagger } from "motion-sv";
	import { onMount } from "svelte";
	import Link from "#lib/components/Link.svelte";
	import Quote from "#lib/components/Quote.svelte";

	const { data } = $props();

	onMount(() => {
		const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduced) return;

		animate(
			[
				["#panel", { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] }],
				[
					"[data-stagger]",
					{ opacity: [0, 1], y: [12, 0], filter: ["blur(4px)", "blur(0px)"] },
					{ at: "-0.6", delay: stagger(0.08) },
				],
			],
			{
				defaultTransition: {
					duration: 0.9,
					ease: [0.19, 1, 0.22, 1],
				},
			},
		);
	});
</script>

<div class="flex min-h-dvh flex-col p-2 pb-4">
	<section id="panel" class="flex flex-1 items-center rounded-3xl glossy">
		<div
			class="mx-auto grid w-full max-w-3xl gap-10 text-fluid-sm sm:grid-cols-[1fr_auto] sm:gap-16"
		>
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
				</nav>
			</div>

			<img
				class="aspect-3/4 w-28 rounded-2xl object-cover opacity-0 outline -outline-offset-1 outline-black/10 max-sm:-order-1 sm:w-48 dark:outline-white/10"
				src="https://r2.olivermrose.com/self.jpg"
				alt="Portrait of Oliver Rose"
				width="160"
				height="213"
				data-stagger
			/>
		</div>
	</section>
</div>
