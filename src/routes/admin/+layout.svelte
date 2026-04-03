<script lang="ts">
	import "@fontsource/space-mono/index.css";
	import "@fontsource-variable/doto/wght.css";
	import "@fontsource-variable/space-grotesk/wght.css";
	import { page } from "$app/state";
	import { logout } from "$lib/admin.remote.js";

	const { data, children } = $props();

	const nav = [
		{ href: "/admin", label: "Dashboard" },
		{ href: "/admin/posts", label: "Posts" },
		{ href: "/admin/quotes", label: "Quotes" },
	];

	function isActive(href: string) {
		if (href === "/admin") {
			return page.url.pathname === "/admin";
		}

		return page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>Admin | oliver rose.</title>
</svelte:head>

{#if data.authenticated}
	<div class="min-h-dvh bg-nd-black pl-52 font-nd-sans text-nd-solid">
		<nav
			class="fixed top-0 left-0 z-10 flex h-dvh w-52 flex-col border-r border-nd-edge bg-nd-surface"
		>
			<div class="px-6 pt-8 pb-6">
				<a href="/admin" class="font-nd-display text-3xl leading-none text-nd-bright">CMS</a>
			</div>

			<div class="flex flex-1 flex-col gap-0.5 px-3">
				{#each nav as item}
					<a
						href={item.href}
						class={[
							"nd-label relative block px-3 py-2.5 transition-colors",
							isActive(item.href)
								? "text-nd-bright before:absolute before:top-1/2 before:left-0 before:h-4 before:w-0.5 before:-translate-y-1/2 before:bg-nd-accent"
								: "text-nd-dim hover:text-nd-muted",
						]}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<div class="space-y-1 border-t border-nd-edge p-3">
				<a
					class="nd-label block px-3 py-2 text-nd-dim transition-colors hover:text-nd-muted"
					href="/"
				>
					Back to site
				</a>

				<form {...logout}>
					<button
						class="nd-label w-full px-3 py-2 text-left text-nd-dim transition-colors hover:text-nd-muted"
						type="submit"
					>
						Sign out
					</button>
				</form>
			</div>
		</nav>

		<div class="px-12 py-12">
			{@render children?.()}
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
