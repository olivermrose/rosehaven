<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Breakpoint from "#lib/components/Breakpoint.svelte";
	import { dev } from "$app/env";

	const { children } = $props();
</script>

<ModeWatcher />

{@render children?.()}

{#if dev}
	<Breakpoint />
{/if}
