<script lang="ts">
	import { AlertCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons";
	import { HugeiconsIcon } from "@hugeicons/svelte";

	import { SITE_NAME } from "#lib";
	import { login } from "#lib/admin.remote.js";

	const issues = $derived(login.fields.password.issues());
</script>

<svelte:head>
	<title>Sign in | admin</title>
</svelte:head>

<div class="flex min-h-dvh items-center justify-center px-4 sm:px-6">
	<div class="w-full max-w-sm">
		<a class="mb-8 block text-center text-lg font-semibold tracking-tight" href="/">
			<span class="period">{SITE_NAME.replace(/\.$/, "")}</span>
		</a>

		<form
			class="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]"
			{...login}
		>
			<div>
				<label for="password">Password</label>
				<input
					id="password"
					class="h-10"
					autocomplete="current-password"
					aria-describedby={issues ? "password-error" : undefined}
					{...login.fields.password.as("password")}
				/>

				{#if issues}
					<p
						id="password-error"
						class="mt-2 flex items-center gap-1.5 text-sm text-error"
					>
						<HugeiconsIcon icon={AlertCircleIcon} size={15} strokeWidth={1.75} />
						{issues[0].message}
					</p>
				{/if}
			</div>

			<button
				class="h-10! w-full"
				data-variant="primary"
				type="submit"
				disabled={login.pending > 0}
			>
				{#if login.pending}
					<HugeiconsIcon
						class="animate-spin"
						icon={Loading03Icon}
						size={14}
						strokeWidth={2}
					/>
				{/if}

				Sign in
			</button>
		</form>
	</div>
</div>
