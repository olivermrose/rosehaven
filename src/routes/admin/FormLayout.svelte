<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

	import type { RemoteFormField, RemoteFormIssue } from "$app/server";

	type Status = "draft" | "published";
	type Intent = "save" | "publish" | "unpublish";

	interface Props extends HTMLFormAttributes {
		issues?: RemoteFormIssue[];
		status?: Status;
		version?: number;
		pending?: boolean;
		intentField: RemoteFormField<Intent>;
		children: Snippet;
		options?: Snippet;
		actions?: Snippet;
	}

	const {
		issues,
		status,
		version,
		pending,
		intentField,
		children,
		options,
		actions,
		...rest
	}: Props = $props();
</script>

<form class="flex items-start gap-8 max-lg:flex-col" {...rest}>
	<div class="w-full min-w-0 flex-1 space-y-8">
		{#if issues}
			<div class="border-l-2 border-peach-400 bg-peach-400/5 px-5 py-3">
				<p class="mb-2 text-peach-600 dark:text-peach-300">Error</p>

				<ul class="space-y-1">
					{#each issues as issue}
						<li class="text-sm text-peach-700 dark:text-peach-200">{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		{@render children()}
	</div>

	<aside
		class={[
			"rounded-2xl border border-border p-6 lg:*:not-last:pb-6",
			"max-lg:grid max-lg:w-full max-lg:grid-cols-2 max-lg:gap-x-6 max-lg:gap-y-6",
			"lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:space-y-6 lg:divide-y lg:divide-border",
		]}
	>
		<div class={[!options && "max-lg:col-span-2"]}>
			<span class="mb-2 block">Status</span>

			<div class="flex items-center gap-2">
				<div
					class={[
						"inline-block rounded-full px-2 py-1 text-xs uppercase",
						status === "published"
							? "bg-aloe-500/40 text-aloe-700 dark:text-aloe-300"
							: "bg-denim-500/40 text-denim-700 dark:text-denim-300",
					]}
				>
					{status ?? "draft"}
				</div>

				{#if version}
					<span class="text-xs text-muted-foreground">v{version}</span>
				{/if}
			</div>

			{#if pending}
				<p class="mt-2 text-xs text-muted-foreground">Unpublished changes</p>
			{/if}
		</div>

		{#if options}
			<div class="flex flex-col gap-2">
				{@render options()}
			</div>
		{/if}

		<div
			class="flex flex-col gap-2 max-lg:col-span-2 max-sm:flex-col sm:max-lg:flex-row lg:flex-col"
		>
			<button class="w-full" data-variant="secondary" {...intentField.as("submit", "save")}>
				{status === "published" ? "Save" : "Save Draft"}
			</button>

			<button class="w-full" data-variant="primary" {...intentField.as("submit", "publish")}>
				{status === "published" ? "Publish Changes" : "Publish"}
			</button>

			{#if status === "published"}
				<button
					class="w-full"
					data-variant="secondary"
					{...intentField.as("submit", "unpublish")}
				>
					Unpublish
				</button>
			{/if}
		</div>

		{#if actions}
			<div class="max-lg:col-span-2">
				{@render actions()}
			</div>
		{/if}
	</aside>
</form>
