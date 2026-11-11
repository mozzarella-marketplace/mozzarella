import { z } from "zod";

const anthropicResponseSchema = z.object({
  stop_reason: z.string(),
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
    }),
  ),
});

export type ParsedAnthropicResponse =
  | { kind: "reply"; reply: string }
  | { kind: "truncated" }
  | { kind: "invalid" }
  | { kind: "empty" };

export const parseAnthropicResponse = (
  body: unknown,
): ParsedAnthropicResponse => {
  const parsed = anthropicResponseSchema.safeParse(body);

  if (!parsed.success) {
    return { kind: "invalid" };
  }

  if (parsed.data.stop_reason === "max_tokens") {
    return { kind: "truncated" };
  }

  const reply = parsed.data.content.find(
    (block) => block.type === "text",
  )?.text;

  return reply?.trim()
    ? { kind: "reply", reply: reply.trim() }
    : { kind: "empty" };
};
