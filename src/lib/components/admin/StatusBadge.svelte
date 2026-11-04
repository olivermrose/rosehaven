<script lang="ts">
	import type { Status } from "#lib/status.js";

	interface Props {
		status: Status;
		pending?: boolean;
	}

	const { status, pending = false }: Props = $props();

	const state = $derived(pending ? "pending" : status);

	const labels = {
		draft: "Draft",
		published: "Published",
		pending: "Unpublished changes",
	};
</script>

<span
	class={[
		"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
		state === "published" && "bg-success/10 text-success",
		state === "pending" && "bg-warning/12 text-warning",
		state === "draft" && "bg-foreground/6 text-muted-foreground",
	]}
>
	{labels[state]}
</span>
