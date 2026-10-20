import { NextResponse } from "next/server";
import { z } from "zod";
import { ProgrammingLanguage } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";

const saveUserStoryBodySchema = z.object({
  content: z.string().trim().min(1),
  language: z.enum(ProgrammingLanguage).nullable(),
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

  const { content, language } = parsed.data;

  try {
    const userStory = await prisma.userStory.upsert({
      where: { sessionId },
      update: { content, language },
      create: { sessionId, content, language },
    });

    return NextResponse.json({ updatedAt: userStory.updatedAt });
  } catch {
    logger.error("user_story_save_failed", { sessionId });
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
