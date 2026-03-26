<script lang="ts">
	const { form } = $props();
</script>

<div class="flex min-h-dvh items-center justify-center bg-neutral-50">
	<div class="w-full max-w-sm">
		<h1 class="mb-8 text-center text-xl font-semibold tracking-tight">Rosehaven</h1>

		<form method="POST" action="?/login" class="space-y-4">
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-neutral-700">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
				/>
			</div>

			{#if form?.error}
				<p class="text-sm text-red-600">{form.error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
