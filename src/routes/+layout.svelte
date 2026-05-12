<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import { dev } from "$app/environment";
	import Breakpoint from "$lib/components/Breakpoint.svelte";

	const { children } = $props();
</script>

<ModeWatcher />

{@render children?.()}

{#if dev}
	<Breakpoint />
{/if}
