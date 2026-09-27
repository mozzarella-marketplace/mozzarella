import { logger } from "@/lib/logging/logger";
import { prisma } from "@/lib/db/prisma";
import { tryCatchAsync } from "@/lib/utils/try-catch";

export const dynamic = "force-dynamic";

export async function GET() {
  const [error] = await tryCatchAsync(prisma.$queryRaw`SELECT 1`);

  if (error) {
    logger.error("Database health check failed");
    return Response.json({ status: "unavailable" }, { status: 503 });
  }

  return Response.json({ status: "ok" });
}
