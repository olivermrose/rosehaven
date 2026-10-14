<script lang="ts">
	import { logout } from "#lib/admin.remote.js";

	interface Props {
		search: string;
		placeholder: string;
		href: string;
		label: string;
	}

	let { search = $bindable(), placeholder, href, label }: Props = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<input id="search" class="max-w-sm" type="text" {placeholder} bind:value={search} />

	<div class="flex items-center gap-2">
		<a {href} data-variant="primary">{label}</a>

		<form {...logout}>
			<button type="submit" data-variant="secondary">Sign Out</button>
		</form>
	</div>
</div>
