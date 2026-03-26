export function match(param): param is `${string}.md` {
	return param.endsWith(".md");
}
