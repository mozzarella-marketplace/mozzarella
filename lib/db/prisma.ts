import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/config/env";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  // Reuses one client across development hot reloads instead of opening new connection pools.
  // It must be `var`: only `var` declarations in `declare global` become properties of globalThis.
  var prismaClient: PrismaClient | undefined;
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });

export const prisma = globalThis.prismaClient ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalThis.prismaClient = prisma;
}
