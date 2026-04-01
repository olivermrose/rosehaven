<script lang="ts">
	import { login } from "$lib/admin.remote";

	const issues = $derived(login.fields.password.issues());
</script>

<div class="flex min-h-dvh items-center justify-center bg-neutral-50">
	<div class="w-full max-w-sm">
		<h1 class="mb-8 text-center text-xl font-semibold tracking-tight">Rosehaven</h1>

		<form class="space-y-4" {...login}>
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-neutral-700">
					Password
				</label>

				<input
					id="password"
					class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm transition-colors outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
					autocomplete="current-password"
					{...login.fields.password.as("password")}
				/>
			</div>

			{#if issues}
				<p class="text-sm text-red-600">{issues[0].message}</p>
			{/if}

			<button
				class="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
				type="submit"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
