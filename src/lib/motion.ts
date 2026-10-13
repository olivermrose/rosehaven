import { animate, cubicBezier, stagger as staggered } from "motion-sv";

export const expoInOut = cubicBezier(0.65, 0.01, 0.05, 1);

export function stagger(node: HTMLElement) {
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	node.dataset.staggerRoot = "";

	const controls = animate(
		node.querySelectorAll("[data-stagger]"),
		{ opacity: [0, 1], y: [12, 0], filter: ["blur(4px)", "blur(0px)"] },
		{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: staggered(0.08) },
	);

	void controls.finished.then(() => {
		node.dataset.staggerDone = "";
	});

	return () => controls.stop();
}
