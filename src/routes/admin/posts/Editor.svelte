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
	import Placeholder from "@tiptap/extension-placeholder";
	import TextAlign from "@tiptap/extension-text-align";
	import StarterKit from "@tiptap/starter-kit";
	import { onDestroy, onMount, settled, untrack } from "svelte";

	interface ToolbarItem {
		icon: IconSvgElement;
		action: string;
		attrs?: Record<string, unknown>;
		exec: () => void;
	}

	interface Props {
		content?: string;
		onupdate?: (html: string) => void;
	}

	const { content, onupdate }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state.raw<Editor>();

	const marks: ToolbarItem[] = [
		{
			icon: TextBoldIcon,
			action: "bold",
			exec: () => editor?.chain().focus().toggleBold().run(),
		},
		{
			icon: TextItalicIcon,
			action: "italic",
			exec: () => editor?.chain().focus().toggleItalic().run(),
		},
		{
			icon: TextStrikethroughIcon,
			action: "strike",
			exec: () => editor?.chain().focus().toggleStrike().run(),
		},
	];

	const blocks: ToolbarItem[] = [
		{
			icon: LeftToRightBlockQuoteIcon,
			action: "blockquote",
			exec: () => editor?.chain().focus().toggleBlockquote().run(),
		},
		{
			icon: LeftToRightListBulletIcon,
			action: "bulletList",
			exec: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			icon: LeftToRightListNumberIcon,
			action: "orderedList",
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
					link: {
						openOnClick: false,
					},
				}),
				TextAlign.configure({ types: ["heading", "paragraph"] }),
				Placeholder.configure({ placeholder: "Start writing\u2026" }),
			],
			content: untrack(() => content),
			editorProps: {
				attributes: {
					class: "prose prose-invert max-w-none outline-none min-h-80 nd-editor-content",
				},
			},
			onTransaction(event) {
				editor = undefined;
				editor = event.editor;
			},
			onUpdate(event) {
				onupdate?.(event.editor.getHTML());
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

	function insertLink() {
		const url = prompt("URL:");
		if (!url || !editor) return;

		editor.chain().focus().setLink({ href: url }).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}
</script>

<div class="overflow-hidden rounded-lg border border-nd-edge bg-nd-surface">
	{#if editor}
		<div class="flex flex-wrap items-center gap-0.5 border-b border-nd-edge px-3 py-2">
			{#each marks as btn}
				<button
					class="nd-toolbar-btn"
					type="button"
					onclick={() => btn.exec()}
					data-active={isActive(btn.action)}
				>
					<HugeiconsIcon icon={btn.icon} size={18} strokeWidth={1.5} />
				</button>
			{/each}

			<span class="mx-1.5 h-5 w-px bg-nd-edge"></span>

			{#each blocks as btn}
				<button
					class="nd-toolbar-btn"
					type="button"
					onclick={() => btn.exec()}
					data-active={isActive(btn.action, btn.attrs)}
				>
					<HugeiconsIcon icon={btn.icon} size={18} strokeWidth={1.5} />
				</button>
			{/each}

			<span class="mx-1.5 h-5 w-px bg-nd-edge"></span>

			{#each aligns as align}
				<button
					class="nd-toolbar-btn"
					type="button"
					onclick={() => editor?.chain().focus().setTextAlign(align.value).run()}
					data-active={editor?.isActive({ textAlign: align.value })}
				>
					<HugeiconsIcon icon={align.icon} size={18} strokeWidth={1.5} />
				</button>
			{/each}

			<span class="mx-1.5 h-5 w-px bg-nd-edge"></span>

			<button
				class="nd-toolbar-btn"
				type="button"
				onclick={insertLink}
				data-active={isActive("link")}
			>
				<HugeiconsIcon icon={Link01Icon} size={18} strokeWidth={1.5} />
			</button>

			<button
				class="nd-toolbar-btn"
				type="button"
				onclick={() => editor?.chain().focus().setHorizontalRule().run()}
			>
				<HugeiconsIcon icon={MinusSignIcon} size={18} strokeWidth={1.5} />
			</button>
		</div>
	{/if}

	<div class="max-h-180 overflow-auto px-5 py-4" bind:this={element}></div>
</div>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: var(--color-nd-dim);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.nd-editor-content) {
		color: var(--color-nd-solid);
		font-family: var(--font-nd-sans);
	}

	:global(.nd-editor-content a) {
		color: var(--color-nd-link);
		text-decoration: underline;
	}

	:global(.nd-editor-content blockquote) {
		border-left-color: var(--color-nd-edge-strong);
		color: var(--color-nd-muted);
	}

	:global(.nd-editor-content hr) {
		border-color: var(--color-nd-edge);
	}

	:global(.nd-editor-content code) {
		color: var(--color-nd-bright);
		font-family: var(--font-nd-mono);
	}

	:global(.nd-editor-content strong) {
		color: var(--color-nd-bright);
	}

	:global(.nd-editor-content ul),
	:global(.nd-editor-content ol) {
		color: var(--color-nd-solid);
	}

	:global(.nd-editor-content li::marker) {
		color: var(--color-nd-dim);
	}
</style>
