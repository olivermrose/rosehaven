import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "$env/dynamic/private";
console.log(env.DATABASE_URL);
export const db = drizzle(env.DATABASE_URL);
