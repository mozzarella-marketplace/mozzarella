import "server-only";
import { z } from "zod";

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().int().positive(),
  refresh_expires_in: z.number().int().positive(),
});

const userInfoSchema = z.object({ sub: z.string().min(1) });

export type KeycloakTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export type TokenResult =
  | { kind: "authenticated"; tokens: KeycloakTokens }
  | { kind: "invalid_credentials" }
  | { kind: "invalid_session" }
  | { kind: "unavailable" };

const getTokenResult = async (response: Response): Promise<TokenResult> => {
  if (!response.ok) {
    let errorResponse: unknown;

    try {
      errorResponse = await response.json();
    } catch {
      return { kind: "unavailable" };
    }

    const error = z.object({ error: z.string() }).safeParse(errorResponse);

    if (
      response.status === 400 &&
      error.success &&
      error.data.error === "invalid_grant"
    ) {
      return { kind: "invalid_session" };
    }

    return { kind: "unavailable" };
  }

  let tokenResponse: unknown;

  try {
    tokenResponse = await response.json();
  } catch {
    return { kind: "unavailable" };
  }

  const token = tokenResponseSchema.safeParse(tokenResponse);

  if (!token.success || token.data.token_type.toLowerCase() !== "bearer") {
    return { kind: "unavailable" };
  }

  return {
    kind: "authenticated",
    tokens: {
      accessToken: token.data.access_token,
      refreshToken: token.data.refresh_token,
      expiresIn: token.data.expires_in,
      refreshExpiresIn: token.data.refresh_expires_in,
    },
  };
};

export const requestKeycloakToken = async ({
  issuer,
  clientId,
  clientSecret,
  username,
}: {
  issuer: string;
  clientId: string;
  clientSecret: string;
  username: string;
}): Promise<TokenResult> => {
  const tokenEndpoint = new URL(
    "protocol/openid-connect/token",
    issuer.endsWith("/") ? issuer : `${issuer}/`,
  );
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "password",
      scope: "openid",
      username,
      password: username,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  const result = await getTokenResult(response);
  return result.kind === "invalid_session"
    ? { kind: "invalid_credentials" }
    : result;
};

export const refreshKeycloakToken = async ({
  issuer,
  clientId,
  clientSecret,
  refreshToken,
}: {
  issuer: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}) => {
  const tokenEndpoint = new URL(
    "protocol/openid-connect/token",
    issuer.endsWith("/") ? issuer : `${issuer}/`,
  );
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  return getTokenResult(response);
};

export const requestKeycloakSubject = async ({
  issuer,
  accessToken,
}: {
  issuer: string;
  accessToken: string;
}) => {
  const userInfoEndpoint = new URL(
    "protocol/openid-connect/userinfo",
    issuer.endsWith("/") ? issuer : `${issuer}/`,
  );
  const response = await fetch(userInfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status === 401) {
    return { kind: "invalid_token" } as const;
  }

  if (!response.ok) {
    return { kind: "unavailable" } as const;
  }

  let userInfo: unknown;

  try {
    userInfo = await response.json();
  } catch {
    return { kind: "unavailable" } as const;
  }

  const result = userInfoSchema.safeParse(userInfo);
  return result.success
    ? ({ kind: "authenticated", subject: result.data.sub } as const)
    : ({ kind: "unavailable" } as const);
};

export const logoutKeycloakSession = async ({
  issuer,
  clientId,
  clientSecret,
  refreshToken,
}: {
  issuer: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}) => {
  const logoutEndpoint = new URL(
    "protocol/openid-connect/logout",
    issuer.endsWith("/") ? issuer : `${issuer}/`,
  );
  const response = await fetch(logoutEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (response.ok) {
    return "logged_out" as const;
  }

  if (response.status === 400) {
    let errorResponse: unknown;

    try {
      errorResponse = await response.json();
    } catch {
      return "unavailable" as const;
    }

    const error = z.object({ error: z.string() }).safeParse(errorResponse);

    if (error.success && error.data.error === "invalid_grant") {
      return "logged_out" as const;
    }
  }

  return "unavailable" as const;
};
