import { anthropicConversationProvider } from "./anthropic-provider";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationProviderInput = {
  system: string;
  messages: ConversationMessage[];
};

export type ConversationProviderResult =
  | { kind: "success"; reply: string }
  | {
      kind: "failure";
      reason:
        | "request_failed"
        | "upstream_error"
        | "invalid_response"
        | "response_limit"
        | "empty_response";
      status?: number;
    };

export type ConversationProvider = {
  generateReply: (
    input: ConversationProviderInput,
  ) => Promise<ConversationProviderResult>;
};

export const conversationProvider: ConversationProvider =
  anthropicConversationProvider;
