<script lang="ts">
	import {
		LeftToRightBlockQuoteIcon,
		LeftToRightListBulletIcon,
		LeftToRightListNumberIcon,
		Link01Icon,
		MinusSignIcon,
		TextAlignCenterIcon,
		TextAlignJustifyCenterIcon,
		TextAlignLeftIcon,
		TextAlignRightIcon,
		TextBoldIcon,
		TextItalicIcon,
		TextStrikethroughIcon,
	} from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import type { IconSvgElement } from "@hugeicons/svelte";
	import { Editor } from "@tiptap/core";
	import TextAlign from "@tiptap/extension-text-align";
	import StarterKit from "@tiptap/starter-kit";
	import { onDestroy, onMount, settled, untrack } from "svelte";
	import { Dialogue } from "./extensions";

	interface ToolbarItem {
		icon: IconSvgElement;
		active?: string | boolean;
		exec: () => void;
	}

	interface Props {
		content?: string;
		dialogue?: boolean;
	}

	let { content = $bindable(), dialogue = false }: Props = $props();

	// oxlint-disable-next-line no-unassigned-vars
	let element: HTMLDivElement;
	let editor = $state.raw<Editor>();

	const startLeft = $derived(editor?.storage.dialogue.start === "other");

	const marks: ToolbarItem[] = [
		{
			icon: TextBoldIcon,
			active: "bold",
			exec: () => editor?.chain().focus().toggleBold().run(),
		},
		{
			icon: TextItalicIcon,
			active: "italic",
			exec: () => editor?.chain().focus().toggleItalic().run(),
		},
		{
			icon: TextStrikethroughIcon,
			active: "strike",
			exec: () => editor?.chain().focus().toggleStrike().run(),
		},
	];

	const blocks: ToolbarItem[] = [
		{
			icon: LeftToRightBlockQuoteIcon,
			active: "blockquote",
			exec: () => editor?.chain().focus().toggleBlockquote().run(),
		},
		{
			icon: LeftToRightListBulletIcon,
			active: "bulletList",
			exec: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			icon: LeftToRightListNumberIcon,
			active: "orderedList",
			exec: () => editor?.chain().focus().toggleOrderedList().run(),
		},
	];

	const aligns = [
		{ icon: TextAlignLeftIcon, value: "left" },
		{ icon: TextAlignCenterIcon, value: "center" },
		{ icon: TextAlignRightIcon, value: "right" },
		{ icon: TextAlignJustifyCenterIcon, value: "justify" },
	];

	onMount(async () => {
		await settled();

		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({
					link: { openOnClick: false },
				}),
				TextAlign.configure({ types: ["paragraph"] }),
				Dialogue,
			],
			content,
			editorProps: {
				attributes: {
					class: "prose dark:prose-invert max-w-none outline-none min-h-80",
				},
			},
			onTransaction(event) {
				editor = undefined;
				editor = event.editor;
			},
			onUpdate(event) {
				content = event.editor.getHTML();
			},
		});
	});

	onDestroy(() => editor?.destroy());

	$effect(() => {
		const _editor = untrack(() => editor);
		if (!_editor || content === undefined) return;

		if (content !== _editor.getHTML()) {
			_editor.commands.setContent(content, { emitUpdate: false });
		}
	});

	$effect(() => {
		const _editor = editor;
		if (!_editor) return;

		if (_editor.storage.dialogue.enabled === dialogue) return;

		_editor.storage.dialogue.enabled = dialogue;
		_editor.view.dispatch(_editor.state.tr);
	});

	function insertLink() {
		// eslint-disable-next-line no-alert
		const url = prompt("URL:");
		if (!url || !editor) return;

		editor.chain().focus().setLink({ href: url }).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}
</script>

<div class="overflow-hidden rounded-2xl border border-border bg-background text-foreground">
	{#if editor}
		<div class="flex flex-wrap items-center gap-0.5 border-b border-border px-3 py-2">
			{#each marks as mark}
				{@render toolbarButton(mark)}
			{/each}

			<span role="separator" aria-orientation="vertical"></span>

			{#if !dialogue}
				{#each blocks as block}
					{@render toolbarButton(block)}
				{/each}

				<span role="separator" aria-orientation="vertical"></span>

				{#each aligns as align}
					{@render toolbarButton({
						icon: align.icon,
						active: editor?.isActive({ textAlign: align.value }),
						exec: () => editor?.chain().focus().setTextAlign(align.value).run(),
					})}
				{/each}

				<span role="separator" aria-orientation="vertical"></span>
			{/if}

			{@render toolbarButton({
				icon: Link01Icon,
				active: isActive("link"),
				exec: insertLink,
			})}

			{@render toolbarButton({
				icon: MinusSignIcon,
				exec: () => editor?.chain().focus().setHorizontalRule().run(),
			})}

			{#if dialogue}
				<span role="separator" aria-orientation="vertical"></span>

				<div class="flex items-center gap-2">
					<span class="font-mono text-[10px] text-muted-foreground uppercase">Start</span>

					<div class="flex overflow-hidden rounded border border-border">
						<button
							class={[
								"flex h-7 w-8 items-center justify-center transition-colors",
								startLeft
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:text-foreground",
							]}
							type="button"
							onclick={() => {
								if (!startLeft) editor?.commands.toggleSpeaker();
							}}
						>
							<HugeiconsIcon icon={TextAlignLeftIcon} size={14} strokeWidth={1.5} />
						</button>

						<button
							class={[
								"flex h-7 w-8 items-center justify-center border-l border-border transition-colors",
								!startLeft
									? "bg-muted text-foreground"
									: "text-muted-foreground hover:text-foreground",
							]}
							type="button"
							onclick={() => {
								if (startLeft) editor?.commands.toggleSpeaker();
							}}
						>
							<HugeiconsIcon icon={TextAlignRightIcon} size={14} strokeWidth={1.5} />
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="bg-neutral-100 px-5 py-4 dark:bg-neutral-950" bind:this={element}></div>
</div>

{#snippet toolbarButton({ icon, active = false, exec }: ToolbarItem)}
	{@const isActive = typeof active === "boolean" ? active : editor?.isActive(active)}

	<button
		class={[
			"flex size-9 items-center justify-center rounded-lg transition-colors",
			"hover:bg-foreground/10 data-[active=true]:bg-foreground/10 data-[active=true]:text-foreground",
		]}
		type="button"
		onclick={exec}
		data-active={isActive}
	>
		<HugeiconsIcon {icon} size={18} strokeWidth={1.5} />
	</button>
{/snippet}

<style>
	[role="separator"] {
		background-color: --alpha(currentcolor / 20%);
		margin-inline: 6px;
		width: 1px;
		height: 20px;
	}

	:global(.tiptap p[data-speaker]) {
		max-width: 60ch;
	}

	:global(.tiptap p[data-speaker="self"]) {
		text-align: right;
		margin-left: auto;
		color: var(--color-wine-500);
	}
</style>
