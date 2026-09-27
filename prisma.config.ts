import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: [".env.local", ".env"] });

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
});
