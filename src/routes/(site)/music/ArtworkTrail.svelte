<script lang="ts">
	import { prefersReducedMotion, Spring } from "svelte/motion";

	interface Props {
		src: string;
	}

	const { src }: Props = $props();

	const SIZE = 176;

	const x = new Spring(0, { stiffness: 0.08, damping: 0.55 });
	const y = new Spring(0, { stiffness: 0.08, damping: 0.55 });

	let visible = $state(false);
	let hovered = $state(false);

	// The gap between where the cursor is and where the artwork has caught up to
	const tilt = $derived(Math.max(-14, Math.min(14, (x.target - x.current) * 0.08)));

	function follow(node: HTMLElement) {
		const row = node.parentElement!;
		const reduced = prefersReducedMotion.current;

		function moveTo(event: PointerEvent, instant: boolean) {
			const rect = row.getBoundingClientRect();

			// Cursor sits at the bottom left corner, so the right edge can't pass the row
			const tx = Math.max(0, Math.min(rect.width - SIZE, event.clientX - rect.left));
			const ty = event.clientY - rect.top;

			void x.set(tx, { instant: instant || reduced });
			void y.set(ty, { instant: instant || reduced });
		}

		function onEnter(event: PointerEvent) {
			if (event.pointerType !== "mouse") return;

			moveTo(event, !visible);
			visible = true;
			hovered = true;
		}

		function onMove(event: PointerEvent) {
			if (event.pointerType !== "mouse") return;

			moveTo(event, false);
			visible = true;
			hovered = true;
		}

		function onLeave() {
			visible = false;
		}

		row.addEventListener("pointerenter", onEnter);
		row.addEventListener("pointermove", onMove);
		row.addEventListener("pointerleave", onLeave);

		return () => {
			row.removeEventListener("pointerenter", onEnter);
			row.removeEventListener("pointermove", onMove);
			row.removeEventListener("pointerleave", onLeave);
		};
	}
</script>

<div
	class="pointer-events-none absolute top-0 left-0 z-10 origin-bottom-left will-change-transform"
	aria-hidden="true"
	{@attach follow}
	style:transform="translate3d({x.current}px, {y.current}px, 0) translate(0, -100%) rotate({tilt}deg)"
>
	<img
		class={[
			"origin-bottom-left rounded-xl object-cover shadow-2xl outline -outline-offset-1 outline-black/10 transition-[opacity,scale] duration-300 ease-out dark:outline-white/10",
			visible ? "scale-100 opacity-100" : "scale-75 opacity-0",
		]}
		src={hovered ? src : undefined}
		alt=""
		decoding="async"
		style:width="{SIZE}px"
		style:height="{SIZE}px"
	/>
</div>
