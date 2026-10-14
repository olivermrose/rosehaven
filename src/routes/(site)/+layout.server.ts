import { verifySession } from "#lib/server/auth.js";

export function load({ cookies }) {
	return {
		authenticated: verifySession(cookies),
	};
}
