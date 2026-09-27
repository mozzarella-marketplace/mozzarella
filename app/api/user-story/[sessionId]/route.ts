import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prismaClient";
import { logger } from "@/lib/logging/logger";

const saveUserStoryBodySchema = z.object({
  content: z.string().trim().min(1),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const parsed = saveUserStoryBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { content } = parsed.data;

  try {
    const userStory = await prisma.userStory.upsert({
      where: { sessionId },
      update: { content },
      create: { sessionId, content },
    });

    return NextResponse.json({ updatedAt: userStory.updatedAt });
  } catch {
    logger.error("user_story_save_failed", { sessionId });
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
