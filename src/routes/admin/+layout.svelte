<script lang="ts">
	import Header from "#lib/components/Header.svelte";
	import { page } from "$app/state";

	const { data, children } = $props();

	const sections = [
		{ href: "/admin", label: "writing" },
		{ href: "/admin/music", label: "music" },
		{ href: "/admin/quotes", label: "quotes" },
	];

	const current = $derived(
		sections.findLast((section) => page.url.pathname.startsWith(section.href))?.href,
	);
</script>

<svelte:head>
	<title>admin | oliver rose.</title>
</svelte:head>

<Header />

{#if data.authenticated}
	<main class="mx-auto max-w-7xl px-6 pt-32 pb-24">
		<nav class="mb-10 flex gap-6 text-sm" aria-label="Admin sections">
			{#each sections as section (section.href)}
				<a
					class="text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
					href={section.href}
					aria-current={current === section.href ? "page" : undefined}
				>
					{section.label}.
				</a>
			{/each}
		</nav>

		{@render children?.()}
	</main>
{:else}
	{@render children?.()}
{/if}
