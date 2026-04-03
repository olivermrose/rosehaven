import { cubicBezier } from "motion-sv";

export const BASE_URL = import.meta.env.DEV ? "http://localhost:5173" : "https://olivermrose.com";
export const SITE_NAME = "oliver rose.";

export const expoInOut = cubicBezier(0.65, 0.01, 0.05, 1);
