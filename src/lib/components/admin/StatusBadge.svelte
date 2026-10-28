<script lang="ts">
	import type { Status } from "./status";

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
		"inline-flex h-5.5 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
		state === "published" && "bg-success/10 text-success",
		state === "pending" && "bg-warning/12 text-warning",
		state === "draft" && "bg-foreground/6 text-muted-foreground",
	]}
>
	<span
		class={[
			"size-1.5 rounded-full",
			state === "draft" ? "ring-1 ring-current ring-inset" : "bg-current",
		]}
		aria-hidden="true"
	></span>

	{labels[state]}
</span>
