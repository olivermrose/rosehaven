<script lang="ts">
	import { onMount } from "svelte";
	import { on } from "svelte/events";
	import { MediaQuery } from "svelte/reactivity";

	interface Segment {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}

	const LINE_LENGTH = 14;
	const VIEWFINDER_PADDING = 6;
	const LERP = 0.22;

	const finePointer = new MediaQuery("(pointer: fine)");

	const cursor = $state({ x: 0, y: 0 });
	const coords = $state<Segment[]>(Array.from({ length: 8 }));

	let visible = $state(false);
	let lines = $state<SVGLineElement[]>([]);
	let target = $state<Element | null>(null);

	let rafId = NaN;

	onMount(() => {
		if (!finePointer.current) return;

		for (let i = 0; i < 8; i++) {
			coords[i] = {
				x1: window.innerWidth / 2,
				y1: window.innerHeight / 2,
				x2: window.innerWidth / 2,
				y2: window.innerHeight / 2,
			};
		}

		rafId = requestAnimationFrame(raf);
		return () => cancelAnimationFrame(rafId);
	});

	function raf() {
		const rect = document.contains(target) ? target?.getBoundingClientRect() : null;
		const corners = rect ? calcViewfinder(rect) : calcCrosshair();

		for (let i = 0; i < 8; i++) {
			const coord = coords[i];
			const corner = corners[i];
			const line = lines[i];

			coord.x1 += (corner.x1 - coord.x1) * LERP;
			coord.y1 += (corner.y1 - coord.y1) * LERP;
			coord.x2 += (corner.x2 - coord.x2) * LERP;
			coord.y2 += (corner.y2 - coord.y2) * LERP;

			if (line) {
				line.setAttribute("x1", coord.x1.toFixed(2));
				line.setAttribute("y1", coord.y1.toFixed(2));
				line.setAttribute("x2", coord.x2.toFixed(2));
				line.setAttribute("y2", coord.y2.toFixed(2));
			}
		}

		rafId = requestAnimationFrame(raf);
	}

	function calcCrosshair() {
		const left = {
			x1: cursor.x - LINE_LENGTH,
			y1: cursor.y,
			x2: cursor.x,
			y2: cursor.y,
		};

		const right = {
			x1: cursor.x,
			y1: cursor.y,
			x2: cursor.x + LINE_LENGTH,
			y2: cursor.y,
		};

		const top = {
			x1: cursor.x,
			y1: cursor.y - LINE_LENGTH,
			x2: cursor.x,
			y2: cursor.y,
		};

		const bottom = {
			x1: cursor.x,
			y1: cursor.y,
			x2: cursor.x,
			y2: cursor.y + LINE_LENGTH,
		};

		return [left, top, right, top, left, bottom, right, bottom];
	}

	function calcViewfinder(rect: DOMRect) {
		const pad = VIEWFINDER_PADDING;
		const x = rect.left - pad;
		const y = rect.top - pad;
		const w = rect.width + pad * 2;
		const h = rect.height + pad * 2;
		const L = Math.min(LINE_LENGTH, w / 2, h / 2);

		return [
			// Top-left
			{ x1: x, y1: y, x2: x + L, y2: y }, // TL horizontal
			{ x1: x, y1: y, x2: x, y2: y + L }, // TL vertical
			// Top-right
			{ x1: x + w - L, y1: y, x2: x + w, y2: y }, // TR horizontal
			{ x1: x + w, y1: y, x2: x + w, y2: y + L }, // TR vertical
			// Bottom-left
			{ x1: x, y1: y + h, x2: x + L, y2: y + h }, // BL horizontal
			{ x1: x, y1: y + h - L, x2: x, y2: y + h }, // BL vertical
			// Bottom-right
			{ x1: x + w - L, y1: y + h, x2: x + w, y2: y + h }, // BR horizontal
			{ x1: x + w, y1: y + h - L, x2: x + w, y2: y + h }, // BR vertical
		];
	}

	function follow(window: Window) {
		const mousemoveoff = on(
			window,
			"mousemove",
			(event) => {
				cursor.x = event.clientX;
				cursor.y = event.clientY;

				if (!visible) visible = true;
			},
			{ passive: true },
		);

		const mouseoveroff = on(
			window,
			"mouseover",
			(event) => {
				target = (event.target as Element | null)?.closest("a, button") ?? null;
			},
			{ passive: true },
		);

		return () => {
			mousemoveoff();
			mouseoveroff();
		};
	}
</script>

<svelte:window {@attach follow} />

<svelte:document
	onmouseenter={() => {
		visible = true;
	}}
	onmouseleave={() => {
		visible = false;
	}}
/>

<svg
	class={[
		"pointer-events-none fixed inset-0 z-9999 h-screen w-screen mix-blend-difference transition-opacity not-pointer-fine:hidden",
		visible ? "opacity-100" : "opacity-0",
	]}
	aria-hidden="true"
>
	{#each { length: 8 }, i}
		<line
			stroke="white"
			stroke-linecap="square"
			vector-effect="non-scaling-stroke"
			bind:this={lines[i]}
		/>
	{/each}
</svg>
