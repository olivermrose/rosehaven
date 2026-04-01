<script lang="ts">
	import { page } from "$app/state";
	import { logout } from "$lib/admin.remote.js";

	const { data, children } = $props();

	const nav = [
		{ href: "/admin", label: "Dashboard" },
		{ href: "/admin/posts", label: "Posts" },
		{ href: "/admin/quotes", label: "Quotes" },
	];
</script>

<svelte:head>
	<title>Admin | oliver rose.</title>
</svelte:head>

{#if data.authenticated}
	<div class="flex min-h-dvh bg-neutral-50 text-neutral-900">
		<nav class="flex w-52 shrink-0 flex-col border-r border-neutral-200 bg-white">
			<div class="px-5 pt-6 pb-4">
				<a href="/admin" class="text-lg font-semibold tracking-tight">CMS</a>
			</div>

			<div class="flex flex-1 flex-col gap-0.5 px-3">
				{#each nav as item}
					<a
						href={item.href}
						class={[
							"rounded-md px-3 py-1.5 text-sm transition-colors",
							page.url.pathname === item.href
								? "bg-neutral-100 font-medium text-neutral-900"
								: "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
						]}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<div class="border-t border-neutral-200 p-3">
				<form {...logout}>
					<button
						class="w-full rounded-md px-3 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
						type="submit"
					>
						Sign out
					</button>
				</form>
			</div>
		</nav>

		<div class="flex-1 overflow-y-auto">
			<div class="mx-auto max-w-4xl px-8 py-8">
				{@render children?.()}
			</div>
		</div>
	</div>
{:else}
	{@render children?.()}
{/if}
