export function slugify(val: string) {
	return val
		.replaceAll(" ", "-")
		.replaceAll(/[^\w-]+/g, "")
		.toLowerCase();
}
