import { Extension } from "@tiptap/core";

type Speaker = "self" | "other";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		dialogue: {
			setSpeaker: (speaker: Speaker) => ReturnType;
			toggleSpeaker: () => ReturnType;
		};
	}

	interface Storage {
		dialogue: {
			enabled: boolean;
			start: Speaker;
		};
	}
}

export const Dialogue = Extension.create({
	name: "dialogue",
	addStorage() {
		return {
			enabled: false,
			start: "self",
		};
	},
	addGlobalAttributes() {
		return [
			{
				types: ["paragraph"],
				attributes: {
					speaker: {
						default: null,
						parseHTML: (element) => element.dataset.speaker || null,
						renderHTML: (attributes) => ({
							"data-speaker": attributes.speaker,
						}),
					},
				},
			},
		];
	},
	addCommands() {
		return {
			setSpeaker(speaker) {
				return ({ commands }) => {
					return commands.updateAttributes("paragraph", { speaker });
				};
			},
		toggleSpeaker: () => ({ tr, dispatch }) => {
			this.editor.storage.dialogue.start =
				this.editor.storage.dialogue.start === "self" ? "other" : "self";

			this.editor.state.doc.descendants((node, pos) => {
				if (node.type.name === "paragraph" && node.attrs.speaker) {
					tr.setNodeMarkup(pos, undefined, {
						...node.attrs,
						speaker: node.attrs.speaker === "other" ? "self" : "other",
					});
				}
			});

			dispatch?.(tr);
			return true;
		},
		};
	},
	addKeyboardShortcuts() {
		return {
			Enter: ({ editor }) => {
				if (!this.storage.enabled) return false;

				const current = editor.getAttributes("paragraph").speaker;
				const next = current === "other" ? "self" : "other";

				editor.commands.splitBlock();
				editor.commands.setSpeaker(next);

				return true;
			},
		};
	},
	onTransaction(event) {
		const { tr, doc } = event.editor.state;
		let changed = false;

		if (event.editor.storage.dialogue.enabled) {
			let isSelf = event.editor.storage.dialogue.start === "self";

			doc.descendants((node, pos) => {
				if (node.type.name === "paragraph") {
					const expected = isSelf ? "self" : "other";

					if (node.attrs.speaker !== expected) {
						tr.setNodeMarkup(pos, undefined, {
							...node.attrs,
							speaker: expected,
						});

						changed = true;
					}

					isSelf = !isSelf;
				}
			});
		} else {
			doc.descendants((node, pos) => {
				if (node.type.name === "paragraph" && node.attrs.speaker) {
					tr.setNodeMarkup(pos, undefined, {
						...node.attrs,
						speaker: null,
					});

					changed = true;
				}
			});
		}

		if (changed) {
			event.editor.view.dispatch(tr);
		}
	},
});
