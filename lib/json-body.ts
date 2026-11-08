import "server-only";

export type JsonBodyResult =
  | { kind: "valid"; body: unknown }
  | { kind: "invalid" }
  | { kind: "too_large" };

export const readJsonBody = async (
  request: Request,
  maxBytes: number,
): Promise<JsonBodyResult> => {
  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { kind: "too_large" };
  }

  if (contentType !== "application/json") {
    return { kind: "invalid" };
  }

  const reader = request.body?.getReader();

  if (!reader) {
    return { kind: "invalid" };
  }

  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    byteLength += value.byteLength;

    if (byteLength > maxBytes) {
      await reader.cancel();
      return { kind: "too_large" };
    }

    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(byteLength);
  let offset = 0;

  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const body: unknown = JSON.parse(new TextDecoder().decode(bodyBytes));
    return { kind: "valid", body };
  } catch {
    return { kind: "invalid" };
  }
};
