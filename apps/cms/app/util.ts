export function slugify(val: string) {
	return val
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "")
		.toLowerCase();
}
