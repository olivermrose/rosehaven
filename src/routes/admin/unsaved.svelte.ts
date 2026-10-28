import { untrack } from "svelte";

import { beforeNavigate } from "$app/navigation";

/**
 * Tracks whether a form has drifted from its last saved values and asks before
 * navigating away with unsaved work.
 */
export class UnsavedChanges {
	#snapshot: () => unknown;
	#baseline = $state<string>();

	readonly dirty = $derived(this.#baseline !== undefined && this.#serialize() !== this.#baseline);

	constructor(snapshot: () => unknown, busy: () => boolean) {
		this.#snapshot = snapshot;

		beforeNavigate(({ cancel, type }) => {
			// A submission that redirects (e.g. a new post to its edit page) isn't leaving
			if (!this.dirty || busy()) return;

			if (type === "leave") {
				// Lets the browser show its own unload prompt
				cancel();
			} else if (!confirm("You have unsaved changes. Leave without saving?")) {
				cancel();
			}
		});
	}

	#serialize() {
		return JSON.stringify(this.#snapshot());
	}

	/** Marks the current values as the saved state */
	commit() {
		this.#baseline = untrack(() => this.#serialize());
	}
}
