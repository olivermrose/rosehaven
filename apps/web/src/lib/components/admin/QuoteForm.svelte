<script lang="ts">
	import type { Quote } from "$lib/server/db/schema";

	interface Props {
		quote?: Quote;
		action?: string;
		error?: string;
	}

	const { quote, action, error }: Props = $props();

	const inputClass =
		"w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
</script>

<form method="POST" {action} class="space-y-5">
	{#if error}
		<div class="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
	{/if}

	<div>
		<label for="text" class="mb-1.5 block text-sm font-medium">Text</label>
		<textarea id="text" name="text" required rows="4" class={inputClass} value={quote?.text ?? ""}
		></textarea>
	</div>

	<div>
		<label for="quotee" class="mb-1.5 block text-sm font-medium">Quotee</label>
		<input id="quotee" name="quotee" required value={quote?.quotee ?? ""} class={inputClass} />
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="sourceTitle" class="mb-1.5 block text-sm font-medium">Source Title</label>
			<input
				id="sourceTitle"
				name="sourceTitle"
				required
				value={quote?.sourceTitle ?? ""}
				class={inputClass}
			/>
		</div>

		<div>
			<label for="sourceUrl" class="mb-1.5 block text-sm font-medium">
				Source URL
				<span class="font-normal text-neutral-400">(optional)</span>
			</label>
			<input
				id="sourceUrl"
				name="sourceUrl"
				type="url"
				value={quote?.sourceUrl ?? ""}
				class={inputClass}
			/>
		</div>
	</div>

	<div class="border-t border-neutral-200 pt-5">
		<button
			type="submit"
			class="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
		>
			{quote ? "Save" : "Create"}
		</button>
	</div>
</form>
