<script lang="ts">
	import { mode } from "mode-watcher";
	import { toggleMode } from "mode-watcher";
	import { motion } from "motion-sv";
	import { TegakiRenderer } from "tegaki/svelte";

	import { SITE_NAME } from "#lib";
	import { logout } from "#lib/admin.remote.js";
	import { page } from "$app/state";

	import bundle from "../../assets/brittany-signature-script/bundle";

	const sections = [
		{ href: "/admin/writing", label: "writing." },
		{ href: "/admin/music", label: "music." },
		{ href: "/admin/quotes", label: "quotes." },
	];

	let toggle = $state<HTMLButtonElement>();

	const isAdmin = $derived(page.url.pathname.startsWith("/admin"));
	const current = $derived(
		sections.find((section) => page.url.pathname.startsWith(section.href))?.href,
	);

	const y = $derived(mode.current === "light" ? "0%" : "-100%");

	async function transitionMode() {
		if (!toggle) {
			return toggleMode();
		}

		document.documentElement.classList.add("transitioning");

		const transition = document.startViewTransition(() => {
			toggleMode();
		});

		transition.finished.finally(() => {
			document.documentElement.classList.remove("transitioning");
		});

		await transition.ready;

		const rect = toggle.getBoundingClientRect();

		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;

		const right = window.innerWidth - rect.left;
		const bottom = window.innerHeight - rect.top;

		const maxRadius = Math.hypot(Math.max(rect.left, right), Math.max(rect.top, bottom));

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration: 500,
				easing: "ease",
				pseudoElement: "::view-transition-new(root)",
			},
		);
	}
</script>

<motion.header
	class="fixed inset-x-0 top-0 z-50 pt-6 mix-blend-difference"
	initial={{ opacity: isAdmin ? 1 : 0 }}
	animate={{ opacity: 1 }}
	transition={{ duration: 0.75 }}
>
	<nav class="mx-auto flex w-full max-w-6xl items-center gap-x-6 px-6">
		<div class="relative">
			<a class="absolute inset-0 z-10" href="/">
				<span class="sr-only">{SITE_NAME}</span>
			</a>

			<TegakiRenderer
				class="text-3xl/normal text-white"
				font={bundle}
				text={SITE_NAME}
				time={{ mode: "uncontrolled", speed: 1.5 }}
			/>
		</div>

		{#if page.data.authenticated && isAdmin}
			<div class="space-x-4" aria-label="Admin sections" role="group">
				{#each sections as section (section.href)}
					<a
						class="blended transition-colors hover:underline aria-[current=page]:text-foreground aria-[current=page]:underline"
						href={section.href}
						aria-current={current === section.href ? "page" : undefined}
					>
						{section.label}
					</a>
				{/each}
			</div>
		{/if}

		<div class="ml-auto flex items-center gap-x-4">
			{#if page.data.authenticated}
				<a class="blended hover:underline" href="/admin">admin.</a>

				<form {...logout}>
					<button class="blended hover:underline" type="submit">sign out.</button>
				</form>
			{/if}

			<button type="button" onclick={transitionMode} bind:this={toggle}>
				<span class="flex h-6 flex-col items-end justify-start overflow-hidden *:blended">
					<motion.span animate={{ y }}>light.</motion.span>
					<motion.span animate={{ y }}>dark.</motion.span>
				</span>
			</button>
		</div>
	</nav>
</motion.header>
