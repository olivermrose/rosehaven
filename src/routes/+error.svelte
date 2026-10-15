<script lang="ts">
	import Link from "#lib/components/Link.svelte";
	import { page } from "$app/state";
</script>

<svelte:head>
	<title>{page.status} | {page.error?.message}</title>
</svelte:head>

<div class="mx-auto flex min-h-dvh flex-col p-4">
	<section class="mx-auto flex max-w-3xl flex-1 items-center">
		<div class="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
			<img
				class="aspect-3/4 w-48 shrink-0 rounded-2xl object-cover img-outline"
				src="https://cataas.com/cat"
				alt="A random cat"
				width="160"
				height="213"
			/>

			<div class="max-w-prose space-y-4">
				<h1 class="text-fluid-xl font-semibold">{page.status}.</h1>
				<p>{page.error?.message}</p>

				<div class="mt-8 flex gap-6">
					<Link href="/" back>home</Link>
				</div>
			</div>
		</div>
	</section>
</div>
