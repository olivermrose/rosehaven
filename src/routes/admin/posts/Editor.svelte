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
	import { Dialogue } from "./extensions";

	interface ToolbarItem {
		icon: IconSvgElement;
		action: string;
		attrs?: Record<string, unknown>;
		exec: () => void;
	}

	interface Props {
		content?: string;
		dialogue?: boolean;
	}

	let { content = $bindable(), dialogue = false }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state.raw<Editor>();

	const startLeft = $derived(editor?.storage.dialogue.start === "other");

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
					link: { openOnClick: false },
				}),
				TextAlign.configure({ types: ["paragraph"] }),
				Placeholder.configure({ placeholder: "Start writing\u2026" }),
				Dialogue,
			],
			content,
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

			{#if !dialogue}
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
			{/if}

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

			{#if dialogue}
				<span class="mx-1.5 h-5 w-px bg-nd-edge"></span>

				<div class="flex items-center gap-2">
					<span class="font-nd-mono text-[10px] tracking-widest text-nd-dim uppercase">
						Start
					</span>

					<div class="flex overflow-hidden rounded border border-nd-edge">
						<button
							class={[
								"flex h-7 w-8 items-center justify-center transition-colors",
								startLeft ? "bg-nd-raised text-nd-bright" : "text-nd-dim hover:text-nd-muted",
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
								"flex h-7 w-8 items-center justify-center border-l border-nd-edge transition-colors",
								!startLeft ? "bg-nd-raised text-nd-bright" : "text-nd-dim hover:text-nd-muted",
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

	:global(.nd-editor-content p[data-speaker]) {
		max-width: 60ch;
	}

	:global(.nd-editor-content p[data-speaker="self"]) {
		text-align: right;
		margin-left: auto;
		color: var(--color-wine-500);
	}
</style>
