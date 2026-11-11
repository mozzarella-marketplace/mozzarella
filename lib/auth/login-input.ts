import "server-only";
import { loginSchema, type LoginInput } from "@/lib/auth/login-schema";
import { readJsonBody } from "@/lib/http/json-body";

const MAX_REQUEST_BYTES = 1024;

export type LoginInputResult =
  | { kind: "valid"; data: LoginInput }
  | { kind: "invalid" }
  | { kind: "too_large" };

export const parseLoginInput = async (
  request: Request,
): Promise<LoginInputResult> => {
  const input = await readJsonBody(request, MAX_REQUEST_BYTES);

  if (input.kind !== "valid") {
    return input;
  }

  const login = loginSchema.safeParse(input.body);

  if (!login.success) {
    return { kind: "invalid" };
  }

  return { kind: "valid", data: login.data };
};
