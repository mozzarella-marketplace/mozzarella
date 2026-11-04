import "server-only";
import { loginSchema, type LoginInput } from "@/lib/auth/login-schema";

const MAX_REQUEST_BYTES = 1024;

export type LoginInputResult =
  | { kind: "valid"; data: LoginInput }
  | { kind: "invalid" }
  | { kind: "too_large" };

const readJsonBody = async (request: Request): Promise<LoginInputResult> => {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return { kind: "too_large" } as const;
  }

  if (contentType !== "application/json") {
    return { kind: "invalid" } as const;
  }

  const reader = request.body?.getReader();

  if (!reader) {
    return { kind: "invalid" } as const;
  }

  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    byteLength += value.byteLength;

    if (byteLength > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return { kind: "too_large" } as const;
    }

    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(byteLength);
  let offset = 0;

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let body: unknown;

  try {
    body = JSON.parse(new TextDecoder().decode(bodyBytes)) as unknown;
  } catch {
    return { kind: "invalid" } as const;
  }

  const login = loginSchema.safeParse(body);
  if (!login.success) {
    return { kind: "invalid" };
  }

  return { kind: "valid", data: login.data };
};

export const parseLoginInput = async (
  request: Request,
): Promise<LoginInputResult> => readJsonBody(request);
