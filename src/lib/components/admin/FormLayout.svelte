<script lang="ts">
	import {
		ArrowLeft01Icon,
		ArrowTurnBackwardIcon,
		CheckmarkCircle02Icon,
		Delete02Icon,
		FloppyDiskIcon,
		LinkSquare02Icon,
		Loading03Icon,
		SentIcon,
	} from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import type { Snippet } from "svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

	import type { Status } from "#lib/status.js";
	import type { RemoteFormField, RemoteFormIssue } from "$app/server";

	import SplitButton from "../SplitButton.svelte";
	import Issues from "./Issues.svelte";
	import StatusBadge from "./StatusBadge.svelte";

	type Intent = "save" | "publish" | "unpublish";

	interface Props extends HTMLFormAttributes {
		entity: string;
		section: { href: string; label: string };
		heading?: string;
		view?: string;
		issues?: RemoteFormIssue[];
		status?: Status;
		version?: number;
		unpublished?: boolean;
		dirty?: boolean;
		busy?: boolean;
		result?: { success: boolean; intent: Intent };
		intentField: RemoteFormField<Intent>;
		ondelete?: () => Promise<void>;
		children: Snippet;
	}

	const {
		entity,
		section,
		heading,
		view,
		issues,
		status,
		version,
		unpublished = false,
		dirty = false,
		busy = false,
		result,
		intentField,
		ondelete,
		children,
		...rest
	}: Props = $props();

	const published = $derived(status === "published");

	let intent = $state<Intent>();
	let deleting = $state(false);
	let save = $state<HTMLButtonElement>();

	const notice = $derived.by(() => {
		if (!result?.success) return null;

		switch (result.intent) {
			case "publish":
				return "Published · changes are live";
			case "unpublish":
				return `Unpublished · ${entity} taken down`;
			default:
				return published ? "Saved · not yet published" : "Draft saved";
		}
	});

	const working = $derived(
		intent === "publish" ? "Publishing…" : intent === "unpublish" ? "Unpublishing…" : "Saving…",
	);

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== "s" || !(event.metaKey || event.ctrlKey)) return;

		event.preventDefault();
		if (!busy) save?.click();
	}

	async function remove() {
		deleting = true;

		try {
			await ondelete?.();
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:window {onkeydown} />

<form class="min-h-dvh" {...rest}>
	<div class="fixed inset-x-0 bottom-4 z-40 px-4 sm:bottom-6">
		<div
			class="mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border border-border bg-surface/90 p-1.5 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.18),0_1px_2px_rgb(0_0_0/0.06)] backdrop-blur-md sm:gap-3"
		>
			<a
				href={section.href}
				data-variant="ghost"
				data-size="icon-sm"
				aria-label="Back to {section.label}"
			>
				<HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
			</a>

			<nav class="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
				<a
					class="text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
					href={section.href}
				>
					{section.label}
				</a>

				<span class="text-muted-foreground/50 max-sm:hidden" aria-hidden="true">/</span>

				<span class="truncate font-medium" aria-current="page">
					{heading || `Untitled ${entity}`}
				</span>
			</nav>

			<div class="ml-auto flex shrink-0 items-center gap-2">
				<p class="flex items-center gap-1.5 text-[0.8125rem]" aria-live="polite">
					{#if busy}
						<HugeiconsIcon
							class="animate-spin text-muted-foreground"
							icon={Loading03Icon}
							size={14}
							strokeWidth={2}
						/>
						<span class="text-muted-foreground max-md:sr-only">{working}</span>
					{:else if dirty}
						<span class="size-1.5 rounded-full bg-warning" aria-hidden="true"></span>
						<span class="text-warning max-md:sr-only">Unsaved changes</span>
					{:else if notice}
						<HugeiconsIcon
							class="text-success"
							icon={CheckmarkCircle02Icon}
							size={15}
							strokeWidth={2}
						/>
						<span class="text-success max-md:sr-only">{notice}</span>
					{/if}
				</p>

				<div class="flex items-center gap-1.5 max-lg:hidden">
					<StatusBadge status={status ?? "draft"} pending={unpublished} />

					{#if version}
						<span class="text-xs text-muted-foreground tabular-nums" title="Version">
							v{version}
						</span>
					{/if}
				</div>

				<span class="mx-1 h-5 w-px bg-border max-lg:hidden" aria-hidden="true"></span>

				{#if view && published}
					<a
						href={view}
						target="_blank"
						data-variant="ghost"
						class="max-sm:hidden"
						data-size="icon"
						aria-label="View live {entity}"
						title="View live {entity}"
					>
						<HugeiconsIcon icon={LinkSquare02Icon} size={17} strokeWidth={1.75} />
					</a>
				{/if}

				<SplitButton
					disabled={busy}
					aria-busy={busy && intent === "publish"}
					onclick={() => (intent = "publish")}
					{...intentField.as("submit", "publish")}
				>
					<HugeiconsIcon
						class={busy && intent === "publish" ? "animate-spin" : ""}
						icon={busy && intent === "publish" ? Loading03Icon : SentIcon}
						size={15}
						strokeWidth={1.75}
					/>

					Publish

					{#snippet menu()}
						{#if view && published}
							<a class="sm:hidden" href={view} target="_blank" role="menuitem">
								<span class="flex items-center gap-2">
									<HugeiconsIcon
										icon={LinkSquare02Icon}
										size={15}
										strokeWidth={1.75}
									/>
									View live {entity}
								</span>
							</a>
						{/if}

						<button
							role="menuitem"
							disabled={busy}
							onclick={() => (intent = "save")}
							{...intentField.as("submit", "save")}
							bind:this={save}
						>
							<span class="flex items-center gap-2">
								<HugeiconsIcon icon={FloppyDiskIcon} size={15} strokeWidth={1.75} />
								{published ? "Save" : "Save draft"}
							</span>
							<kbd>⌘S</kbd>
						</button>

						{#if published}
							<button
								role="menuitem"
								disabled={busy}
								onclick={() => (intent = "unpublish")}
								{...intentField.as("submit", "unpublish")}
							>
								<span class="flex items-center gap-2">
									<HugeiconsIcon
										icon={ArrowTurnBackwardIcon}
										size={15}
										strokeWidth={1.75}
									/>
									Unpublish
								</span>
								<span class="text-xs text-muted-foreground">Back to draft</span>
							</button>
						{/if}

						{#if ondelete}
							<div role="separator"></div>

							<button
								class="text-error hover:bg-error/10!"
								type="button"
								role="menuitem"
								disabled={deleting}
								onclick={remove}
							>
								<span class="flex items-center gap-2">
									<HugeiconsIcon
										icon={Delete02Icon}
										size={15}
										strokeWidth={1.75}
									/>
									Delete {entity}
								</span>
							</button>
						{/if}
					{/snippet}
				</SplitButton>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-4xl px-6 pt-28 pb-40">
		<Issues {entity} {issues} />

		{@render children()}
	</div>
</form>
