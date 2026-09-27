import "./lib/config/load-env";
import { defineConfig } from "prisma/config";
import { env } from "./lib/config/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env.DATABASE_URL,
  },
});
