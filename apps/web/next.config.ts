import type { NextConfig } from "next";
import { withEve } from "eve/next";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {};
const eveRoot = fileURLToPath(new URL("../..", import.meta.url));
// The agent's keys, as `pnpm dev` loads them. Next.js reads env files from apps/web only.
const env = `${eveRoot}.env.local`;
if (existsSync(env)) process.loadEnvFile(env);

export default withEve(nextConfig, { eveRoot });
