<script lang="ts">
	import { T, useLoader, useTask, useThrelte } from "@threlte/core";
	import { animate, clamp, mix } from "motion-sv";
	import type { AnimationPlaybackControls } from "motion-sv";
	import { TextureLoader, Vector2 } from "three";
	import fragmentShader from "../shaders/distortion.frag";
	import vertexShader from "../shaders/distortion.vert";

	const { src }: { src: string } = $props();

	const expoOut = [0.19, 1, 0.22, 1] as const;

	const mouse = new Vector2();
	const uMouse = new Vector2();

	const { canvas } = useThrelte();
	const { load } = useLoader(TextureLoader);

	let controls: AnimationPlaybackControls | undefined;

	const uIntro = $state({ value: 0 });
	const uDistort = $state({ value: 0 });

	useTask(() => {
		uMouse.set(mix(uMouse.x, mouse.x, 0.1), mix(uMouse.y, mouse.y, 0.1));
	});

	canvas.addEventListener("pointerenter", () => {
		controls = animate(uIntro, { value: 1 }, { duration: 5, ease: expoOut });

		animate(uDistort, { value: 1 }, { duration: 1, ease: expoOut });
	});

	canvas.addEventListener("pointerleave", () => {
		controls?.stop();

		animate(uDistort, { value: 0 }, { duration: 1, ease: expoOut });
	});

	canvas.addEventListener("pointermove", (event) => {
		const rect = canvas.getBoundingClientRect();

		const x = (event.clientX - rect.left) / canvas.offsetWidth;
		const y = 1 - (event.clientY - rect.top) / canvas.offsetHeight;

		mouse.set(clamp(0, 1, x), clamp(0, 1, y));
	});
</script>

{#await load(src) then texture}
	<T.Mesh>
		<T.PlaneGeometry args={[2, 2]} />

		<T.ShaderMaterial
			{fragmentShader}
			{vertexShader}
			uniforms={{
				uIntro,
				uDistort,
				uRadius: { value: 0.95 },
				uStrength: { value: 1.1 },
				uMouse: { value: uMouse },
				uMouseIntro: { value: new Vector2(0.5, 0) },
				uTexture: { value: texture },
				uTextureResolution: {
					value: new Vector2(texture.image.width, texture.image.height),
				},
				uResolution: {
					value: new Vector2(canvas.offsetWidth, canvas.offsetHeight),
				},
			}}
		/>
	</T.Mesh>
{/await}
