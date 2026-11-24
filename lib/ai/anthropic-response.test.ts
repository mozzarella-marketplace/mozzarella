import assert from "node:assert/strict";
import test from "node:test";
import { parseAnthropicResponse } from "./anthropic-response";

test("parses a completed Anthropic text response", () => {
  assert.deepEqual(
    parseAnthropicResponse({
      stop_reason: "end_turn",
      content: [{ type: "text", text: "  שלום  " }],
    }),
    { kind: "reply", reply: "שלום" },
  );
});

test("reports truncated and malformed Anthropic responses", () => {
  assert.deepEqual(
    parseAnthropicResponse({ stop_reason: "max_tokens", content: [] }),
    { kind: "truncated" },
  );
  assert.deepEqual(parseAnthropicResponse(null), { kind: "invalid" });
});
