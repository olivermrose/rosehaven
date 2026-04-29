<script lang="ts">
	import "../app.css";
	import { dev } from "$app/environment";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { ModeWatcher } from "mode-watcher";

	const { children } = $props();
</script>

<ModeWatcher />

{@render children?.()}

{#if dev}
	<Breakpoint />
{/if}
