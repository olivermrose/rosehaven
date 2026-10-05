import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
	DATABASE_URL: { static: true },
	ADMIN_PASSWORD_HASH: { static: true },
});
