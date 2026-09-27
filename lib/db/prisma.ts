import "server-only";
import { PrismaClient, type Prisma } from "@prisma/client";
import { env, nodeEnvironmentSchema, type Environment } from "@/lib/config/env";

const prismaLogLevels = {
  [nodeEnvironmentSchema.enum.development]: ["warn", "error"],
  [nodeEnvironmentSchema.enum.test]: ["error"],
  [nodeEnvironmentSchema.enum.production]: ["error"],
} satisfies Record<Environment["NODE_ENV"], Prisma.LogLevel[]>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogLevels[env.NODE_ENV],
  });

if (env.NODE_ENV !== nodeEnvironmentSchema.enum.production) {
  globalForPrisma.prisma = prisma;
}
