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

	import { postComponentNames } from "#lib/post-components.js";

	import { CustomComponent, Dialogue } from "./extensions";
	import ComponentSelect from "./writing/ComponentSelect.svelte";

	interface ToolbarItem {
		icon: IconSvgElement;
		label: string;
		active?: string | boolean;
		exec: () => void;
	}

	interface Props {
		content?: string;
		category?: string;
		components?: boolean;
	}

	let { content = $bindable(), category, components = true }: Props = $props();

	// oxlint-disable-next-line no-unassigned-vars
	let element: HTMLDivElement;
	let editor = $state.raw<Editor>();
	const isDialogue = $derived(category === "dialogue");
	const startLeft = $derived(editor?.storage.dialogue.start === "other");

	const marks: ToolbarItem[] = [
		{
			icon: TextBoldIcon,
			label: "Bold (⌘B)",
			active: "bold",
			exec: () => editor?.chain().focus().toggleBold().run(),
		},
		{
			icon: TextItalicIcon,
			label: "Italic (⌘I)",
			active: "italic",
			exec: () => editor?.chain().focus().toggleItalic().run(),
		},
		{
			icon: TextStrikethroughIcon,
			label: "Strikethrough (⌘⇧S)",
			active: "strike",
			exec: () => editor?.chain().focus().toggleStrike().run(),
		},
	];

	const blocks: ToolbarItem[] = [
		{
			icon: LeftToRightBlockQuoteIcon,
			label: "Quote",
			active: "blockquote",
			exec: () => editor?.chain().focus().toggleBlockquote().run(),
		},
		{
			icon: LeftToRightListBulletIcon,
			label: "Bulleted list",
			active: "bulletList",
			exec: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			icon: LeftToRightListNumberIcon,
			label: "Numbered list",
			active: "orderedList",
			exec: () => editor?.chain().focus().toggleOrderedList().run(),
		},
	];

	const aligns = [
		{ icon: TextAlignLeftIcon, label: "Align left", value: "left" },
		{ icon: TextAlignCenterIcon, label: "Align center", value: "center" },
		{ icon: TextAlignRightIcon, label: "Align right", value: "right" },
		{ icon: TextAlignJustifyCenterIcon, label: "Justify", value: "justify" },
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
				CustomComponent,
			],
			content,
			editorProps: {
				attributes: {
					class: "outline-none min-h-[50vh]",
					"aria-label": "Body",
					"aria-multiline": "true",
					role: "textbox",
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
		void isDialogue;

		const _editor = untrack(() => editor);
		if (!_editor) return;

		if (_editor.storage.dialogue.enabled === isDialogue) return;

		_editor.storage.dialogue.enabled = isDialogue;
		_editor.view.dispatch(_editor.state.tr);
	});

	function toggleLink() {
		if (!editor) return;

		if (editor.isActive("link")) {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		const url = prompt("Link URL");
		if (!url) return;

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}
</script>

{#if editor}
	<div
		class="sticky top-17 z-30 mx-auto mb-10 flex w-fit max-w-full [scrollbar-width:none] items-center gap-0.5 overflow-x-auto rounded-xl border border-border bg-surface/90 p-1 shadow-[0_6px_20px_-8px_rgb(0_0_0/0.18),0_1px_2px_rgb(0_0_0/0.06)] backdrop-blur-md sm:flex-wrap sm:justify-center sm:overflow-visible"
		role="toolbar"
		aria-label="Formatting"
	>
		{#each marks as mark (mark.label)}
			{@render toolbarButton(mark)}
		{/each}

		<span role="separator" aria-orientation="vertical"></span>

		{#if !isDialogue}
			{#each blocks as block (block.label)}
				{@render toolbarButton(block)}
			{/each}

			<span role="separator" aria-orientation="vertical"></span>

			{#each aligns as align (align.value)}
				{@render toolbarButton({
					icon: align.icon,
					label: align.label,
					active: editor?.isActive({ textAlign: align.value }),
					exec: () => editor?.chain().focus().setTextAlign(align.value).run(),
				})}
			{/each}

			<span role="separator" aria-orientation="vertical"></span>
		{/if}

		{@render toolbarButton({
			icon: Link01Icon,
			label: isActive("link") ? "Remove link" : "Add link",
			active: isActive("link"),
			exec: toggleLink,
		})}

		{@render toolbarButton({
			icon: MinusSignIcon,
			label: "Divider",
			exec: () => editor?.chain().focus().setHorizontalRule().run(),
		})}

		{#if components && postComponentNames.length > 0}
			<span role="separator" aria-orientation="vertical"></span>

			<ComponentSelect
				names={postComponentNames}
				onselect={(name) => editor?.chain().focus().insertComponent(name).run()}
			/>
		{/if}

		{#if isDialogue}
			<span role="separator" aria-orientation="vertical"></span>

			<div class="flex shrink-0 items-center gap-2 pr-1 pl-1.5">
				<span class="text-xs text-muted-foreground">Opens with</span>

				<div
					class="flex rounded-md bg-foreground/6 p-0.5"
					role="radiogroup"
					aria-label="Opening speaker"
				>
					{@render speakerButton("Them", TextAlignLeftIcon, startLeft, false)}
					{@render speakerButton("You", TextAlignRightIcon, !startLeft, true)}
				</div>
			</div>
		{/if}
	</div>
{/if}

<div class="min-h-[50vh]" data-content data-category={category} bind:this={element}></div>

{#snippet speakerButton(label: string, icon: IconSvgElement, selected: boolean, self: boolean)}
	<button
		class={[
			"flex h-6 items-center gap-1 rounded px-1.5 text-xs font-medium transition-colors",
			selected
				? "bg-surface text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.1)]"
				: "text-muted-foreground hover:text-foreground",
		]}
		type="button"
		role="radio"
		aria-checked={selected}
		onclick={() => {
			if (!selected) editor?.commands.toggleSpeaker();
		}}
	>
		{#if !self}
			<HugeiconsIcon {icon} size={13} strokeWidth={1.75} />
		{/if}

		{label}

		{#if self}
			<HugeiconsIcon {icon} size={13} strokeWidth={1.75} />
		{/if}
	</button>
{/snippet}

{#snippet toolbarButton({ icon, label, active = false, exec }: ToolbarItem)}
	{@const pressed = typeof active === "boolean" ? active : (editor?.isActive(active) ?? false)}

	<button
		class={[
			"flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/65 transition-colors",
			"hover:bg-foreground/8 hover:text-foreground",
			"aria-pressed:bg-foreground aria-pressed:text-background",
		]}
		type="button"
		aria-label={label}
		aria-pressed={typeof active === "string" || active ? pressed : undefined}
		title={label}
		onclick={exec}
	>
		<HugeiconsIcon {icon} size={17} strokeWidth={1.75} />
	</button>
{/snippet}

<style>
	[role="separator"] {
		flex-shrink: 0;
		background-color: var(--color-border);
		margin-inline: 4px;
		width: 1px;
		height: 18px;
	}

	[data-content] :global(.ProseMirror > p:only-child:has(> br:only-child)::before) {
		content: "Start writing…";
		float: left;
		height: 0;
		color: var(--color-muted-foreground);
		pointer-events: none;
	}

	[data-content] :global([data-component]) {
		--bracket: var(--color-muted-foreground);
		color: light-dark(var(--color-plum-700), var(--color-plum-300));
		cursor: pointer;

		&::before {
			content: "<";
			color: var(--bracket);
		}

		&::after {
			content: " />";
			color: var(--bracket);
			font-feature-settings: "calt" 0;
		}

		:global(&.ProseMirror-selectednode) {
			border-style: solid;
			border-color: var(--color-plum-400);
			background-color: --alpha(var(--color-plum-400) / 12%);
		}
	}
</style>
