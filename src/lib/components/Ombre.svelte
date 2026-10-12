<script lang="ts">
	import { Shader, FilmGrain, SineWave, SolidColor, WaveDistortion } from "shaders/svelte";

	interface Props {
		vibrant: string;
		muted: string;
	}

	const { vibrant, muted }: Props = $props();
</script>

<Shader>
	<SolidColor color="#000000" />

	<SineWave
		amplitude={0.52}
		angle={77}
		blendMode="normal-oklch"
		color={muted}
		frequency={0.35}
		position={{
			x: 0.38,
			y: 0.32,
		}}
		softness={0.42}
		speed={0.3}
		thickness={0.95}
	/>

	<SineWave
		amplitude={0.28}
		angle={144}
		blendMode="normal-oklab"
		color={vibrant}
		frequency={0.45}
		position={{
			x: 0.72,
			y: 0.68,
		}}
		softness={0.62}
		speed={0.5}
		thickness={0.58}
	/>

	<WaveDistortion angle={135} edges="mirror" frequency={1.6} speed={0.2} strength={0.45} />

	<FilmGrain strength={0.3} />
</Shader>

<style>
	:global(.shader) {
		width: 100%;
		height: 100%;
	}
</style>
