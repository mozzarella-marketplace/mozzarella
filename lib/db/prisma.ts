import "server-only";
import { PrismaClient } from "@prisma/client";
import { env, nodeEnvironmentSchema, type Environment } from "@/lib/config/env";
import { logLevels } from "@/lib/logging/logger";

const prismaLogLevels = {
  [nodeEnvironmentSchema.enum.development]: [logLevels.warn, logLevels.error],
  [nodeEnvironmentSchema.enum.test]: [logLevels.error],
  [nodeEnvironmentSchema.enum.production]: [logLevels.error],
} satisfies Record<
  Environment["NODE_ENV"],
  (typeof logLevels.warn | typeof logLevels.error)[]
>;

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
