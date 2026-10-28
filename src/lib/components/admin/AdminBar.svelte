<script lang="ts">
	import { Logout03Icon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import { mode, toggleMode } from "mode-watcher";

	import { SITE_NAME } from "#lib";
	import { logout } from "#lib/admin.remote.js";
	import { page } from "$app/state";

	const sections = [
		{ href: "/admin/writing", label: "Writing" },
		{ href: "/admin/music", label: "Music" },
		{ href: "/admin/quotes", label: "Quotes" },
	];

	const current = $derived(
		sections.find((section) => page.url.pathname.startsWith(section.href))?.href,
	);
</script>

<header class="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
	<div class="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
		<a class="shrink-0 font-semibold tracking-tight max-sm:hidden" href="/">
			<span class="period">{SITE_NAME.replace(/\.$/, "")}</span>
		</a>

		<nav class="flex h-full items-stretch" aria-label="Admin sections">
			{#each sections as section (section.href)}
				<a
					class={[
						"relative flex items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
						"after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 after:transition-opacity",
						"aria-[current=page]:text-foreground aria-[current=page]:after:opacity-100",
					]}
					href={section.href}
					aria-current={current === section.href ? "page" : undefined}
				>
					{section.label}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-1">
			<button
				type="button"
				data-variant="ghost"
				data-size="icon"
				aria-label="Switch to {mode.current === 'dark' ? 'light' : 'dark'} mode"
				onclick={toggleMode}
			>
				<HugeiconsIcon
					icon={mode.current === "dark" ? Sun03Icon : Moon02Icon}
					size={18}
					strokeWidth={1.75}
				/>
			</button>

			<form {...logout}>
				<button type="submit" data-variant="ghost">
					<HugeiconsIcon icon={Logout03Icon} size={18} strokeWidth={1.75} />
					<span class="max-sm:sr-only">Sign out</span>
				</button>
			</form>
		</div>
	</div>
</header>
