<script lang="ts">
	import type { RemoteFormIssue } from "$app/server";

	import Alert from "./Alert.svelte";

	interface Props {
		entity: string;
		issues?: RemoteFormIssue[];
	}

	const { entity, issues }: Props = $props();
</script>

{#if issues?.length}
	<div class="mb-10">
		<Alert
			tone="error"
			title={issues.length === 1
				? `This ${entity} couldn't be saved`
				: `${issues.length} problems kept this ${entity} from saving`}
		>
			<ul class="space-y-0.5">
				{#each issues as issue, i (i)}
					<li>
						{#if issue.path.length}
							<span class="font-medium capitalize">{issue.path.join(".")}</span>:
						{/if}

						{issue.message}
					</li>
				{/each}
			</ul>
		</Alert>
	</div>
{/if}
