import { existsSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

const localEnvironmentFile = ".env.local";

if (existsSync(localEnvironmentFile)) {
  process.loadEnvFile(localEnvironmentFile);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // The CLI (migrate, seed) needs an unpooled connection; the app's own Prisma Client
    // (prisma/prisma.ts) reads the pooled DATABASE_URL directly and does not use this config.
    url: env("DIRECT_URL"),
  },
});
