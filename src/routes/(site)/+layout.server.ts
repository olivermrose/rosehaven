import { verifySession } from "#lib/server/auth.js";

export async function load({ cookies }) {
	return {
		authenticated: verifySession(cookies),
	};
}
