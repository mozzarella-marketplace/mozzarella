import { NextResponse } from "next/server";
import { z } from "zod";
import { ConversationRole } from "@/lib/generated/prisma/enums";
import { requireAuth, AuthError } from "@/lib/auth/current-user";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { buildCustomerConversationSystemPrompt } from "@/lib/ai/customer-conversation-prompt";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";
import { readJsonBody } from "@/lib/json-body";
import {
  MAX_CONVERSATION_MESSAGE_LENGTH,
  MAX_DAILY_MESSAGES,
} from "@/consts/conversation";

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

const anthropicResponseSchema = z.object({
  stop_reason: z.string(),
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
    }),
  ),
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

    if (!env.ANTHROPIC_API_KEY) {
      logger.error("Anthropic API key is not configured");
      return jsonResponse({ error: messages.unavailable }, 503);
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

    let providerResponse: Response;

    try {
      providerResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": env.ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: "claude-sonnet-5-5",
          max_tokens: 1_024,
          system: buildCustomerConversationSystemPrompt(customer),
          messages: [
            ...history.reverse().map(({ role, content }) => ({
              role,
              content,
            })),
            { role: ConversationRole.user, content: parsedInput.data.message },
          ],
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      logger.error("Anthropic messages request failed");
      return jsonResponse({ error: messages.unavailable }, 502);
    }

    if (!providerResponse.ok) {
      logger.error("Anthropic returned an unsuccessful response", {
        status: providerResponse.status,
      });
      return jsonResponse({ error: messages.unavailable }, 502);
    }

    let responseBody: unknown;

    try {
      responseBody = await providerResponse.json();
    } catch {
      logger.error("Anthropic returned invalid JSON");
      return jsonResponse({ error: messages.unavailable }, 502);
    }

    const parsedResponse = anthropicResponseSchema.safeParse(responseBody);
    if (
      parsedResponse.success &&
      parsedResponse.data.stop_reason === "max_tokens"
    ) {
      logger.error("Anthropic customer response reached the token limit");
      return jsonResponse({ error: messages.unavailable }, 502);
    }

    const reply = parsedResponse.success
      ? parsedResponse.data.content.find((block) => block.type === "text")?.text
      : undefined;

    if (!reply?.trim()) {
      logger.error("Anthropic returned no text response");
      return jsonResponse({ error: messages.unavailable }, 502);
    }

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
