<script lang="ts">
	import { Editor } from "@tiptap/core";
	import Link from "@tiptap/extension-link";
	import Placeholder from "@tiptap/extension-placeholder";
	import TextAlign from "@tiptap/extension-text-align";
	import StarterKit from "@tiptap/starter-kit";
	import { onDestroy, onMount } from "svelte";

	interface Props {
		content?: string;
		onupdate?: (html: string) => void;
	}

	const { content, onupdate }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor>();

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Link.configure({ openOnClick: false }),
				TextAlign.configure({ types: ["heading", "paragraph"] }),
				Placeholder.configure({ placeholder: "Start writing…" }),
			],
			content,
			editorProps: {
				attributes: {
					class: "prose prose-neutral max-w-none outline-none min-h-80 dark:prose-invert",
				},
			},
			onUpdate: ({ editor: e }) => {
				onupdate?.(e.getHTML());
			},
		});
	});

	onDestroy(() => editor?.destroy());

	function cmd(fn: (e: Editor) => void) {
		return () => {
			if (editor) fn(editor);
		};
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}

	function insertLink() {
		const url = prompt("URL:");
		if (!url || !editor) return;
		editor.chain().focus().setLink({ href: url }).run();
	}

	type Btn = { label: string; action: string; attrs?: Record<string, unknown> };

	const marks: Btn[] = [
		{ label: "B", action: "bold" },
		{ label: "I", action: "italic" },
		{ label: "S", action: "strike" },
	];

	const blocks: Btn[] = [
		{ label: "H2", action: "heading", attrs: { level: 2 } },
		{ label: "H3", action: "heading", attrs: { level: 3 } },
		{ label: "BQ", action: "blockquote" },
		{ label: "UL", action: "bulletList" },
		{ label: "OL", action: "orderedList" },
	];

	const aligns = [
		{ label: "L", value: "left" },
		{ label: "C", value: "center" },
		{ label: "R", value: "right" },
		{ label: "J", value: "justify" },
	];

	function toggle(btn: Btn) {
		if (!editor) return;
		const chain = editor.chain().focus();
		if (btn.action === "heading")
			chain.toggleHeading({ level: (btn.attrs?.level as 2 | 3) ?? 2 }).run();
		else if (btn.action === "blockquote") chain.toggleBlockquote().run();
		else if (btn.action === "bulletList") chain.toggleBulletList().run();
		else if (btn.action === "orderedList") chain.toggleOrderedList().run();
		else if (btn.action === "bold") chain.toggleBold().run();
		else if (btn.action === "italic") chain.toggleItalic().run();
		else if (btn.action === "strike") chain.toggleStrike().run();
	}
</script>

<div class="rounded-lg border border-neutral-200 bg-white">
	{#if editor}
		<div class="flex flex-wrap gap-0.5 border-b border-neutral-200 px-2 py-1.5">
			{#each marks as btn}
				<button
					type="button"
					onclick={() => toggle(btn)}
					class={[
						"rounded px-2 py-1 text-xs font-medium transition-colors",
						isActive(btn.action)
							? "bg-neutral-900 text-white"
							: "text-neutral-600 hover:bg-neutral-100",
					]}
				>
					{btn.label}
				</button>
			{/each}

			<span class="mx-1 w-px self-stretch bg-neutral-200"></span>

			{#each blocks as btn}
				<button
					type="button"
					onclick={() => toggle(btn)}
					class={[
						"rounded px-2 py-1 text-xs font-medium transition-colors",
						isActive(btn.action, btn.attrs)
							? "bg-neutral-900 text-white"
							: "text-neutral-600 hover:bg-neutral-100",
					]}
				>
					{btn.label}
				</button>
			{/each}

			<span class="mx-1 w-px self-stretch bg-neutral-200"></span>

			{#each aligns as align}
				<button
					type="button"
					onclick={cmd((e) => e.chain().focus().setTextAlign(align.value).run())}
					class={[
						"rounded px-2 py-1 text-xs font-medium transition-colors",
						editor?.isActive({ textAlign: align.value })
							? "bg-neutral-900 text-white"
							: "text-neutral-600 hover:bg-neutral-100",
					]}
				>
					{align.label}
				</button>
			{/each}

			<span class="mx-1 w-px self-stretch bg-neutral-200"></span>

			<button
				type="button"
				onclick={insertLink}
				class={[
					"rounded px-2 py-1 text-xs font-medium transition-colors",
					isActive("link") ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100",
				]}
			>
				Link
			</button>

			<button
				type="button"
				onclick={cmd((e) => e.chain().focus().setHorizontalRule().run())}
				class="rounded px-2 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
			>
				HR
			</button>
		</div>
	{/if}

	<div bind:this={element} class="px-4 py-3"></div>
</div>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: var(--color-neutral-400);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
