<script lang="ts">
	import { PersistedState } from "runed";
	import { onMount } from "svelte";
	import type { Post } from "$lib/server/db/schema";
	import { on } from "svelte/events";

	const { posts }: { posts: Post[] } = $props();

	const seen = new PersistedState<number[]>("rosehaven:seen-posts", [], {
		storage: "local",
	});

	let newPosts = $state.raw(new Set<number>());
	const categories = $derived(Object.groupBy(posts, (post) => post.category));

	onMount(() => {
		const ids = posts.map((p) => p.id);

		if (seen.current.length > 0) {
			const seenIds = new Set(seen.current);
			newPosts = new Set(ids.filter((id) => !seenIds.has(id)));
		}

		seen.current = ids;
	});

	function reveal(delay = 0) {
		return (node: HTMLElement) => {
			node.style.setProperty("--reveal-delay", `${delay}ms`);

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							node.dataset.active = "true";
							node.classList.add("active");
							observer.unobserve(node);
						}
					}
				},
				{ rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
			);

			observer.observe(node);

			return () => observer.disconnect();
		};
	}

	function magnetic(node: HTMLElement) {
		const strength = 8;

		const pointermoveoff = on(node, "pointermove", (event) => {
			const rect = node.getBoundingClientRect();

			const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
			const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;

			node.style.setProperty("--mx", `${x}px`);
			node.style.setProperty("--my", `${y}px`);
		});

		const pointerleaveoff = on(node, "pointerleave", () => {
			node.style.setProperty("--mx", "0");
			node.style.setProperty("--my", "0");
		});

		return () => {
			pointermoveoff();
			pointerleaveoff();
		};
	}
</script>

<section id="anthology" class="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
	<hgroup class="max-w-prose" {@attach reveal()}>
		<h1 class="text-fluid-3xl/tight">
			To write is to discover the essence of what remains
			<span class="font-serif italic">untold</span>.
		</h1>

		<p class="mt-2">
			As I drift off into reverie, I find myself running through a thousand different scenarios of
			"What if?" My life is not bound by the earth I stand upon.
		</p>
	</hgroup>

	<div class="space-y-24 pt-20 sm:space-y-32">
		{#each Object.entries(categories) as [category, posts], categoryIndex (category)}
			<section
				id={category}
				class="reveal group/sec grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12"
				{@attach reveal(categoryIndex * 80)}
			>
				<header class="lg:col-span-4">
					<div class="lg:sticky lg:top-24">
						<div class="flex items-center gap-3 font-mono text-xs uppercase opacity-50">
							<span>{String(categoryIndex + 1).padStart(2, "0")}</span>

							<span
								class="rule h-px flex-1 origin-left scale-x-0 bg-denim-400 transition-transform delay-300 duration-1200 ease-out-expo group-data-active/sec:scale-x-100"
								aria-hidden="true"
							></span>

							<span>
								{String(posts.length).padStart(2, "0")}
								{posts.length === 1 ? "entry" : "entries"}
							</span>
						</div>

						<h2 class="period mt-4 font-serif text-fluid-3xl/none font-light tracking-tight italic">
							{category.replace("-", " ").toLowerCase()}
						</h2>
					</div>
				</header>

				<ul
					class="focus grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-current/10 ring-1 ring-current/10 lg:col-span-8"
				>
					{#each posts as post, postIndex (post.id)}
						{@const title = post.title + (post.explicit ? " (Explicit)" : "")}
						{@const featured = postIndex === 0 && posts.length > 2}

						<li
							class={[
								"cell group/cell reveal relative isolate flex flex-col bg-background p-5 will-change-transform sm:p-6",
								featured && "col-span-2",
							]}
							{@attach reveal(categoryIndex * 80 + postIndex * 60)}
							{@attach magnetic}
						>
							<a class="absolute inset-0 z-10" {title} href="/writing/{post.slug}">
								<span class="sr-only">{title}</span>
							</a>

							<span
								class="pointer-events-none absolute inset-y-3 left-0 w-px origin-bottom scale-y-0 bg-plum-500 transition-transform duration-700 ease-out-expo group-hover/cell:scale-y-100"
								aria-hidden="true"
							></span>

							<div class="flex items-baseline justify-between font-mono text-xs uppercase">
								<span class="opacity-50">{String(postIndex + 1).padStart(2, "0")}</span>

								{#if newPosts.has(post.id)}
									<span class="flex items-center gap-1.5 text-peach-500">
										<span class="relative flex size-1.5">
											<span
												class="absolute inline-flex h-full w-full animate-ping rounded-full bg-peach-400"
											></span>

											<span class="relative inline-flex size-1.5 rounded-full bg-peach-400"></span>
										</span>

										New
									</span>
								{/if}
							</div>

							<div class="mt-3 flex items-center gap-2">
								<h3
									class={[
										"post-title line-clamp-2 font-medium transition-transform duration-700 ease-out-expo group-hover:-translate-y-px",
										featured ? "text-fluid-lg" : "text-fluid-base",
									]}
									style:view-transition-class="post-title"
									style:view-transition-name="post-{post.id}"
								>
									{post.title}
								</h3>

								{#if post.explicit}
									<svg class="size-4 shrink-0 opacity-30" viewBox="0 0 24 24" aria-hidden="true">
										<path
											fill="currentColor"
											d="M9 17h6v-2h-4v-2h4v-2h-4V9h4V7H9zm-4 4q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
										/>
									</svg>
								{/if}
							</div>

							<p
								class={[
									"mt-2 text-fluid-xs opacity-70 transition-opacity duration-500",
									featured ? "line-clamp-3" : "line-clamp-2",
								]}
							>
								{post.excerpt}
							</p>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>

<style>
	.reveal {
		opacity: 0;
		transform: translate3d(0, 1.5rem, 0);
		filter: blur(6px);
		transition:
			opacity 900ms var(--ease-out-expo),
			transform 900ms var(--ease-out-expo),
			filter 900ms var(--ease-out-expo);
		transition-delay: var(--reveal-delay, 0ms);

		&:global([data-active]) {
			opacity: 1;
			transform: translate3d(0, 0, 0);
			filter: blur(0);
		}
	}

	.cell {
		--mx: 0px;
		--my: 0px;
		transition:
			transform 600ms var(--ease-out-expo),
			filter 300ms ease-out;

		&:hover {
			transform: translate3d(var(--mx), calc(var(--my) - 2px), 0);
		}

		&:active {
			transform: translate3d(var(--mx), 0, 0) scale(0.99);
		}
	}

	.focus {
		@media (hover: hover) {
			&:has(> li:hover) li:not(:hover) {
				filter: blur(2px);
				opacity: 0.5;
			}
		}

		> li {
			transition:
				filter 500ms var(--ease-out-expo),
				opacity 500ms var(--ease-out-expo),
				transform 600ms var(--ease-out-expo);
		}
	}
</style>
