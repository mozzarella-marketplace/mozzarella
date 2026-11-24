import { NextResponse } from "next/server";
import { z } from "zod";
import { ConversationRole } from "@/lib/generated/prisma/enums";
import { requireAuth, AuthError } from "@/lib/auth/current-user";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { buildCustomerConversationSystemPrompt } from "@/lib/ai/customer-conversation-prompt";
import { conversationProvider } from "@/lib/ai/conversation-provider";
import { prisma } from "@/prisma/prisma";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";
import { readJsonBody } from "@/lib/http/json-body";
import {
  MAX_CONVERSATION_MESSAGE_LENGTH,
  MAX_DAILY_MESSAGES,
} from "@/consts/conversation";
import { defaultLocale } from "@/consts/locales";

const MAX_REQUEST_BYTES = 4_096;
const MAX_HISTORY_MESSAGES = 20;

const jsonResponse = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const conversationBodySchema = z.object({
  message: z.string().trim().min(1).max(MAX_CONVERSATION_MESSAGE_LENGTH),
});

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) => {
  const messages = getMessages().conversation.api;

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

    const parsedInput = conversationBodySchema.safeParse(input.body);

    if (!parsedInput.success) {
      return jsonResponse({ error: messages.invalidRequest }, 400);
    }

    const customer = await prisma.customer.findFirst({
      where: { id: parsedCustomerId.data, isActive: true },
      select: {
        name: true,
        role: true,
        businessName: true,
        city: true,
        summary: true,
        topic: true,
        difficulty: true,
      },
    });

    if (!customer) {
      return jsonResponse({ error: messages.notFound }, 404);
    }

    const sessionId = `${user.id}:${parsedCustomerId.data}`;
    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const dailyMessageCount = await prisma.conversationMessage.count({
      where: {
        sessionId: { startsWith: `${user.id}:` },
        role: ConversationRole.user,
        createdAt: { gte: dayStart },
      },
    });

    if (dailyMessageCount >= MAX_DAILY_MESSAGES) {
      return jsonResponse(
        { error: messages.dailyLimit(MAX_DAILY_MESSAGES) },
        429,
      );
    }

    const history = await prisma.conversationMessage.findMany({
      where: { sessionId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: MAX_HISTORY_MESSAGES,
      select: { role: true, content: true },
    });

    const result = await conversationProvider.generateReply({
      system: buildCustomerConversationSystemPrompt(customer, defaultLocale),
      messages: [
        ...history.reverse().map(({ role, content }) => ({
          role:
            role === ConversationRole.user
              ? ConversationRole.user
              : ConversationRole.assistant,
          content,
        })),
        { role: ConversationRole.user, content: parsedInput.data.message },
      ],
    });

    if (result.kind === "failure") {
      const logMessages = {
        request_failed: "AI provider request failed",
        upstream_error: "AI provider returned an unsuccessful response",
        invalid_response: "AI provider returned an invalid response",
        response_limit: "AI provider response reached the token limit",
        empty_response: "AI provider returned no text response",
      } as const;

      logger.error(
        logMessages[result.reason],
        result.status ? { status: result.status } : undefined,
      );
      return jsonResponse({ error: messages.unavailable }, 502);
    }
    const reply = result.reply;

    await prisma.$transaction([
      prisma.conversationMessage.create({
        data: {
          sessionId,
          role: ConversationRole.user,
          content: parsedInput.data.message,
        },
      }),
      prisma.conversationMessage.create({
        data: {
          sessionId,
          role: ConversationRole.assistant,
          content: reply.trim(),
        },
      }),
    ]);

    return jsonResponse({ reply: reply.trim() }, 200);
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonResponse({ error: messages.unavailable }, error.status);
    }

    logger.error("Customer conversation failed");
    return jsonResponse({ error: messages.unavailable }, 500);
  }
};
