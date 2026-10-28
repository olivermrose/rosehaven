<script lang="ts">
	import {
		ArrowLeft01Icon,
		CheckmarkCircle02Icon,
		Delete02Icon,
		LinkSquare02Icon,
		Loading03Icon,
		MoreHorizontalIcon,
	} from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import type { Snippet } from "svelte";
	import type { HTMLFormAttributes } from "svelte/elements";

	import type { RemoteFormField, RemoteFormIssue } from "$app/server";

	import Alert from "./Alert.svelte";
	import type { Status } from "./status";
	import StatusBadge from "./StatusBadge.svelte";

	type Intent = "save" | "publish" | "unpublish";

	interface Props extends HTMLFormAttributes {
		noun: string;
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
		noun,
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

	const id = $props.id();
	const menuId = `actions-${id}`;
	const anchor = `--actions-${id}`;

	const published = $derived(status === "published");

	let intent = $state<Intent>();
	let deleting = $state(false);
	let save = $state<HTMLButtonElement>();
	let menu = $state<HTMLDivElement>();

	const notice = $derived.by(() => {
		if (!result?.success) return null;

		switch (result.intent) {
			case "publish":
				return "Published · changes are live";
			case "unpublish":
				return `Unpublished · ${noun} taken down`;
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
		menu?.hidePopover();
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
	<header class="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
		<div class="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
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
					{heading || `Untitled ${noun}`}
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
						aria-label="View live {noun}"
						title="View live {noun}"
					>
						<HugeiconsIcon icon={LinkSquare02Icon} size={17} strokeWidth={1.75} />
					</a>
				{/if}

				{#if published || ondelete}
					<button
						type="button"
						data-variant="ghost"
						data-size="icon"
						aria-label="More actions"
						popovertarget={menuId}
						style:anchor-name={anchor}
					>
						<HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={1.75} />
					</button>

					<div
						id={menuId}
						class="m-0 min-w-48 rounded-lg border border-border bg-surface p-1 text-sm shadow-[0_8px_24px_-6px_rgb(0_0_0/0.18),0_2px_6px_-2px_rgb(0_0_0/0.08)]"
						popover
						role="menu"
						style:position-anchor={anchor}
						bind:this={menu}
					>
						{#if view && published}
							<a
								class="menu-item sm:hidden"
								href={view}
								target="_blank"
								role="menuitem"
							>
								View live {noun}
								<HugeiconsIcon
									class="text-muted-foreground"
									icon={LinkSquare02Icon}
									size={15}
									strokeWidth={1.75}
								/>
							</a>
						{/if}

						{#if published}
							<button
								class="menu-item"
								role="menuitem"
								disabled={busy}
								{...intentField.as("submit", "unpublish")}
								onclick={() => {
									intent = "unpublish";
									menu?.hidePopover();
								}}
							>
								Unpublish
								<span class="text-xs text-muted-foreground">Back to draft</span>
							</button>
						{/if}

						{#if ondelete}
							{#if published}
								<div class="-mx-1 my-1 h-px bg-border" role="separator"></div>
							{/if}

							<button
								class="menu-item text-error hover:bg-error/10!"
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
									Delete {noun}
								</span>
							</button>
						{/if}
					</div>
				{/if}

				<button
					data-variant="secondary"
					disabled={busy}
					aria-busy={busy && intent === "save"}
					title="Save (⌘S)"
					bind:this={save}
					{...intentField.as("submit", "save")}
					onclick={() => (intent = "save")}
				>
					{published ? "Save" : "Save draft"}
				</button>

				<button
					data-variant="primary"
					disabled={busy}
					aria-busy={busy && intent === "publish"}
					{...intentField.as("submit", "publish")}
					onclick={() => (intent = "publish")}
				>
					{#if busy && intent === "publish"}
						<HugeiconsIcon
							class="animate-spin"
							icon={Loading03Icon}
							size={14}
							strokeWidth={2}
						/>
					{/if}

					{#if published}
						Publish<span class="max-sm:hidden">&nbsp;changes</span>
					{:else}
						Publish
					{/if}
				</button>
			</div>
		</div>
	</header>

	<div class="mx-auto max-w-4xl px-6 pt-12 pb-40">
		{#if issues?.length}
			<div class="mb-10">
				<Alert
					tone="error"
					title={issues.length === 1
						? `This ${noun} couldn't be saved`
						: `${issues.length} problems kept this ${noun} from saving`}
				>
					<ul class="space-y-0.5">
						{#each issues as issue, i (i)}
							<li>
								{#if issue.path.length}
									<span class="font-medium capitalize"
										>{issue.path.join(".")}</span
									>:
								{/if}

								{issue.message}
							</li>
						{/each}
					</ul>
				</Alert>
			</div>
		{/if}

		{@render children()}
	</div>
</form>

<style>
	[role="menu"] {
		position: fixed;
		inset: auto;
		margin-top: 0.375rem;
		position-area: bottom span-left;
	}

	.menu-item {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-radius: var(--radius-md);
		padding: 0.4375rem 0.625rem;
		text-align: left;
		transition: background-color 150ms ease;

		&:hover:not(:disabled) {
			background-color: --alpha(var(--foreground) / 7%);
		}

		&:disabled {
			opacity: 0.5;
		}
	}
</style>
