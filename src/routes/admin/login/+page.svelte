<script lang="ts">
	import { login } from "$lib/admin.remote";

	const issues = $derived(login.fields.password.issues());
</script>

<div class="flex min-h-dvh items-center justify-center bg-nd-black font-nd-sans">
	<div class="w-full max-w-xs">
		<div class="mb-16 text-center">
			<h1 class="font-nd-display text-5xl/none tracking-tight text-nd-bright">CMS</h1>
			<p class="nd-label mt-4">Rosehaven Admin</p>
		</div>

		<form class="space-y-8" {...login}>
			<div>
				<label for="password" class="nd-label mb-3 block">Password</label>
				<input
					id="password"
					class="nd-input font-nd-mono"
					autocomplete="current-password"
					placeholder="Enter password"
					{...login.fields.password.as("password")}
				/>
			</div>

			{#if issues}
				<p class="font-nd-mono text-xs tracking-wide text-nd-accent">
					[ERROR] {issues[0].message}
				</p>
			{/if}

			<button class="nd-btn nd-btn-primary w-full" type="submit">Sign in</button>
		</form>
	</div>
</div>
