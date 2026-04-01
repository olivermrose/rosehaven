import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "$env/static/private";
console.log(DATABASE_URL);
export const db = drizzle(DATABASE_URL);
