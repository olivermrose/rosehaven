<script lang="ts">
	import { login } from "$lib/admin.remote";

	const issues = $derived(login.fields.password.issues());
</script>

<div class="flex min-h-dvh items-center justify-center px-4 sm:px-6">
	<form class="w-full max-w-sm space-y-8" {...login}>
		<label class="sr-only" for="password">Password</label>
		<input
			id="password"
			autocomplete="off"
			placeholder="Password"
			{...login.fields.password.as("password")}
		/>

		{#if issues}
			<p class="text-sm text-peach-600 dark:text-peach-300">
				{issues[0].message}
			</p>
		{/if}

		<button class="w-full" data-variant="primary" type="submit">sign in</button>
	</form>
</div>
