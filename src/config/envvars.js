// https://docs.astro.build/en/guides/configuring-astro/#environment-variables
import { loadEnv } from "vite";
export const { PUBLIC_VERCEL_GIT_COMMIT_REF, GIT_BRANCH, PUBLIC_VERCEL_BRANCH_URL, SITE, MODE } = loadEnv(process.env.NODE_ENV, process.cwd(), "");