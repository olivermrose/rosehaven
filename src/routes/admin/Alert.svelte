<script lang="ts">
	import {
		Alert02Icon,
		AlertCircleIcon,
		CheckmarkCircle02Icon,
		InformationCircleIcon,
	} from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";
	import type { Snippet } from "svelte";

	interface Props {
		tone: "success" | "warning" | "error" | "info";
		title?: string;
		children?: Snippet;
	}

	const { tone, title, children }: Props = $props();

	const icons = {
		success: CheckmarkCircle02Icon,
		warning: Alert02Icon,
		error: AlertCircleIcon,
		info: InformationCircleIcon,
	};

	const colors = {
		success: "text-success",
		warning: "text-warning",
		error: "text-error",
		info: "text-info",
	};
</script>

<div
	class={[
		"flex gap-3 rounded-lg border px-4 py-3 text-sm",
		tone === "success" && "border-success/25 bg-success/6",
		tone === "warning" && "border-warning/25 bg-warning/6",
		tone === "error" && "border-error/25 bg-error/6",
		tone === "info" && "border-info/25 bg-info/6",
	]}
	role={tone === "error" ? "alert" : "status"}
>
	<HugeiconsIcon
		class="mt-px shrink-0 {colors[tone]}"
		icon={icons[tone]}
		size={18}
		strokeWidth={1.75}
	/>

	<div class="min-w-0 space-y-1">
		{#if title}
			<p class="font-medium {colors[tone]}">
				{title}
			</p>
		{/if}

		<div class="text-foreground/80">
			{@render children?.()}
		</div>
	</div>
</div>
