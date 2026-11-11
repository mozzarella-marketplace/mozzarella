import assert from "node:assert/strict";
import { test } from "node:test";
import { parseLoginInput } from "@/lib/auth/login-input";
import { readJsonBody } from "@/lib/http/json-body";

const jsonRequest = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/example", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
  });

test("reads JSON at the byte limit, including Hebrew", async () => {
  const body = JSON.stringify({ content: "שלום" });
  const byteLength = new TextEncoder().encode(body).byteLength;

  assert.deepEqual(await readJsonBody(jsonRequest(body), byteLength), {
    kind: "valid",
    body: { content: "שלום" },
  });
  assert.deepEqual(await readJsonBody(jsonRequest(body), byteLength - 1), {
    kind: "too_large",
  });
});

test("rejects oversized streamed input without a Content-Length header", async () => {
  const requestOptions: RequestInit & { duplex: "half" } = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: new ReadableStream<Uint8Array>({
      start: (controller) => {
        controller.enqueue(new TextEncoder().encode('{"content":'));
        controller.enqueue(new TextEncoder().encode('"too large"}'));
        controller.close();
      },
    }),
    duplex: "half",
  };
  const request = new Request("http://localhost/api/example", requestOptions);

  assert.deepEqual(await readJsonBody(request, 16), { kind: "too_large" });
});

test("rejects malformed JSON, unsupported content types, and declared oversized bodies", async () => {
  assert.deepEqual(await readJsonBody(jsonRequest("{"), 16), {
    kind: "invalid",
  });
  assert.deepEqual(
    await readJsonBody(jsonRequest("{}", { "Content-Type": "text/plain" }), 16),
    { kind: "invalid" },
  );
  assert.deepEqual(
    await readJsonBody(jsonRequest("{}", { "Content-Length": "17" }), 16),
    { kind: "too_large" },
  );
});

test("preserves login normalization, validation, and the original byte limit", async () => {
  assert.deepEqual(
    await parseLoginInput(jsonRequest('{"classId":"b001","userId":"a001"}')),
    { kind: "valid", data: { classId: "B001", userId: "A001" } },
  );
  assert.deepEqual(
    await parseLoginInput(jsonRequest('{"classId":"invalid","userId":"a001"}')),
    { kind: "invalid" },
  );
  assert.deepEqual(
    await parseLoginInput(jsonRequest(`"${"x".repeat(1024)}"`)),
    {
      kind: "too_large",
    },
  );
});
