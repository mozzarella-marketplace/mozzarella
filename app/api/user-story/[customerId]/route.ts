import { NextResponse } from "next/server";
import { z } from "zod";
import { ProgrammingLanguage } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { AuthError, requireAuth } from "@/lib/auth/current-user";
import { readJsonBody } from "@/lib/json-body";
import { getMessages } from "@/lib/i18n/messages";

const MAX_REQUEST_BYTES = 65_536;

const jsonResponse = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const saveUserStoryBodySchema = z.object({
  content: z.string().trim().min(1).max(MAX_REQUEST_BYTES),
  language: z.enum(ProgrammingLanguage).nullable(),
});

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) => {
  const messages = getMessages().userStory.api;

  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: messages.invalidRequest }, 403);
  }

  const { customerId } = await params;
  const parsedCustomerId = z.uuid().safeParse(customerId);

  if (!parsedCustomerId.success) {
    return jsonResponse({ error: messages.invalidRequest }, 400);
  }

  try {
    const user = await requireAuth();
    const input = await readJsonBody(request, MAX_REQUEST_BYTES);

    if (input.kind !== "valid") {
      return jsonResponse(
        { error: messages.invalidRequest },
        input.kind === "too_large" ? 413 : 400,
      );
    }

    const parsed = saveUserStoryBodySchema.safeParse(input.body);

    if (!parsed.success) {
      return jsonResponse({ error: messages.invalidRequest }, 400);
    }

    const customer = await prisma.customer.findFirst({
      where: { id: parsedCustomerId.data, isActive: true },
      select: { id: true },
    });

    if (!customer) {
      return jsonResponse({ error: messages.notFound }, 404);
    }

    const { content, language } = parsed.data;
    const sessionId = `${user.id}:${customer.id}`;
    const userStory = await prisma.userStory.upsert({
      where: { sessionId },
      update: { content, language },
      create: { sessionId, content, language },
    });

    return jsonResponse({ updatedAt: userStory.updatedAt }, 200);
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse({ error: messages.unavailable }, error.status);
    }

    logger.error("User story save failed");
    return jsonResponse({ error: messages.saveFailed }, 500);
  }
};
