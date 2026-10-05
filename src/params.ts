import { defineParams } from "@sveltejs/kit/params";

function matchMd(param: string): param is `${string}.md` {
	return param.endsWith(".md");
}

export const params = defineParams({
	md: (param) => (matchMd(param) ? param : undefined),
});
