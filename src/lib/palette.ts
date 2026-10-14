import chroma from "chroma-js";

import { artworkAt } from "#lib";

export interface Palette {
	vibrant: string;
	muted: string;
}

interface Swatch {
	hex: string;
	saturation: number;
	lightness: number;
	population: number;
}

interface Target {
	saturation: number;
	minSaturation: number;
	maxSaturation: number;
	lightness: number;
	minLightness: number;
	maxLightness: number;
}

// Targets and weights follow Android's Palette / node-vibrant defaults
const VIBRANT: Target = {
	saturation: 1,
	minSaturation: 0.35,
	maxSaturation: 1,
	lightness: 0.5,
	minLightness: 0.3,
	maxLightness: 0.7,
};

const MUTED: Target = {
	saturation: 0.3,
	minSaturation: 0,
	maxSaturation: 0.4,
	lightness: 0.5,
	minLightness: 0.3,
	maxLightness: 0.7,
};

const WEIGHT = { saturation: 3, lightness: 6, population: 1 };

// Bits kept per channel when bucketing similar colors together
const QUANTIZE_BITS = 5;

/**
 * Groups pixels into buckets of similar color and averages each bucket.
 * Transparent and near-white/near-black pixels are skipped since they never
 * make good accents.
 */
function quantize(pixels: Uint8ClampedArray): Swatch[] {
	const shift = 8 - QUANTIZE_BITS;
	const buckets = new Map<number, { r: number; g: number; b: number; count: number }>();

	for (let i = 0; i < pixels.length; i += 4) {
		const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
		if (a < 125) continue;

		const key =
			((r >> shift) << (QUANTIZE_BITS * 2)) | ((g >> shift) << QUANTIZE_BITS) | (b >> shift);
		const bucket = buckets.get(key);

		if (bucket) {
			bucket.r += r;
			bucket.g += g;
			bucket.b += b;
			bucket.count++;
		} else {
			buckets.set(key, { r, g, b, count: 1 });
		}
	}

	const max = Math.max(1, ...Array.from(buckets.values(), (bucket) => bucket.count));

	return Array.from(buckets.values(), ({ r, g, b, count }) => {
		const color = chroma(r / count, g / count, b / count);
		const [, saturation, lightness] = color.hsl();

		return {
			hex: color.hex(),
			// Grays have no hue, which chroma reports as NaN saturation
			saturation: Number.isNaN(saturation) ? 0 : saturation,
			lightness,
			population: count / max,
		};
	}).filter((swatch) => swatch.lightness > 0.05 && swatch.lightness < 0.95);
}

function score(swatch: Swatch, target: Target) {
	const saturation = 1 - Math.abs(swatch.saturation - target.saturation);
	const lightness = 1 - Math.abs(swatch.lightness - target.lightness);

	return (
		saturation * WEIGHT.saturation +
		lightness * WEIGHT.lightness +
		swatch.population * WEIGHT.population
	);
}

function pick(swatches: Swatch[], target: Target, exclude?: string) {
	const inRange = swatches.filter(
		(swatch) =>
			swatch.hex !== exclude &&
			swatch.saturation >= target.minSaturation &&
			swatch.saturation <= target.maxSaturation &&
			swatch.lightness >= target.minLightness &&
			swatch.lightness <= target.maxLightness,
	);

	// Fall back to the closest color overall when nothing fits the range,
	// e.g. a black-and-white cover has no vibrant swatch
	const candidates = inRange.length > 0 ? inRange : swatches;

	return candidates.reduce<Swatch | undefined>(
		(best, swatch) => (!best || score(swatch, target) > score(best, target) ? swatch : best),
		undefined,
	);
}

export function extractPalette(pixels: Uint8ClampedArray): Palette | null {
	const swatches = quantize(pixels);

	const vibrant = pick(swatches, VIBRANT);
	const muted = pick(swatches, MUTED, vibrant?.hex);

	if (!vibrant || !muted) return null;

	return { vibrant: vibrant.hex, muted: muted.hex };
}

export async function extractPaletteFromUrl(url: string, size = 64): Promise<Palette | null> {
	try {
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.src = artworkAt(url, 100);

		await image.decode();

		// Downscaling first keeps this fast and averages out noise
		const canvas = new OffscreenCanvas(size, size);
		const context = canvas.getContext("2d");
		if (!context) return null;

		context.drawImage(image, 0, 0, size, size);

		return extractPalette(context.getImageData(0, 0, size, size).data);
	} catch {
		return null;
	}
}
