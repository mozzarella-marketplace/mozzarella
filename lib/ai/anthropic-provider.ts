import { env } from "@/lib/config/env";
import { parseAnthropicResponse } from "./anthropic-response";
import type {
  ConversationProvider,
  ConversationProviderResult,
} from "./conversation-provider";

const ANTHROPIC_CONFIG = {
  endpoint: "https://api.anthropic.com/v1/messages",
  apiVersion: "2023-06-01",
  model: "claude-sonnet-5-5",
  maxOutputTokens: 1_024,
  timeoutMs: 30_000,
} as const;

export const anthropicConversationProvider: ConversationProvider = {
  generateReply: async ({
    system,
    messages,
  }): Promise<ConversationProviderResult> => {
    let response: Response;

    try {
      response = await fetch(ANTHROPIC_CONFIG.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": ANTHROPIC_CONFIG.apiVersion,
          "x-api-key": env.ANTHROPIC_API_KEY,
        },
        body: JSON.stringify({
          model: ANTHROPIC_CONFIG.model,
          max_tokens: ANTHROPIC_CONFIG.maxOutputTokens,
          system,
          messages,
        }),
        signal: AbortSignal.timeout(ANTHROPIC_CONFIG.timeoutMs),
      });
    } catch {
      return { kind: "failure", reason: "request_failed" };
    }

    if (!response.ok) {
      return {
        kind: "failure",
        reason: "upstream_error",
        status: response.status,
      };
    }

    let body: unknown;

    try {
      body = await response.json();
    } catch {
      return { kind: "failure", reason: "invalid_response" };
    }

    const parsed = parseAnthropicResponse(body);

    if (parsed.kind !== "reply") {
      return {
        kind: "failure",
        reason:
          parsed.kind === "truncated"
            ? "response_limit"
            : parsed.kind === "invalid"
              ? "invalid_response"
              : "empty_response",
      };
    }

    return { kind: "success", reply: parsed.reply };
  },
};
