export const BASE_URL = import.meta.env.DEV ? "http://localhost:5173" : "https://olivermrose.com";
export const SITE_NAME = "oliver rose.";

export function rand(min: number, max: number) {
	return min + Math.random() * (max - min);
}

export function slugify(val: string) {
	return val
		.replaceAll(" ", "-")
		.replaceAll(/[^\w-]+/g, "")
		.toLowerCase();
}

const ITUNES_SIZE = /\/\d+x\d+bb\.jpg$/;

export function artworkAt(url: string, size: number) {
	return url.replace(ITUNES_SIZE, `/${size}x${size}bb.jpg`);
}
