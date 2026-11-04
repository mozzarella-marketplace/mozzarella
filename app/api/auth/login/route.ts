import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { parseLoginInput } from "@/lib/auth/login-input";
import {
  logoutKeycloakSession,
  requestKeycloakSubject,
  requestKeycloakToken,
} from "@/lib/auth/keycloak";
import {
  clearKeycloakTokens,
  getKeycloakTokens,
  setKeycloakTokens,
} from "@/lib/auth/session";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";

export const runtime = "nodejs";

const jsonResponse = (body: object, status: number, headers?: HeadersInit) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export const POST = async (request: Request) => {
  const messages = getMessages().auth.login;

  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: messages.invalidInput }, 403);
  }

  if (
    !env.KEYCLOAK_ISSUER ||
    !env.KEYCLOAK_CLIENT_ID ||
    !env.KEYCLOAK_CLIENT_SECRET
  ) {
    logger.error("Keycloak login is not configured");
    return jsonResponse({ error: messages.unavailable }, 503);
  }

  const keycloakConfiguration = {
    issuer: env.KEYCLOAK_ISSUER,
    clientId: env.KEYCLOAK_CLIENT_ID,
    clientSecret: env.KEYCLOAK_CLIENT_SECRET,
  };

  let input: Awaited<ReturnType<typeof parseLoginInput>>;

  try {
    input = await parseLoginInput(request);
  } catch {
    return jsonResponse({ error: messages.invalidInput }, 400);
  }

  if (input.kind !== "valid") {
    return jsonResponse(
      { error: messages.invalidInput },
      input.kind === "too_large" ? 413 : 400,
    );
  }

  const username = `${input.data.classId}-${input.data.userId}`;
  let tokenResult: Awaited<ReturnType<typeof requestKeycloakToken>>;

  try {
    tokenResult = await requestKeycloakToken({
      ...keycloakConfiguration,
      username,
    });
  } catch {
    logger.error("Keycloak token request failed");
    return jsonResponse({ error: messages.unavailable }, 503);
  }

  if (tokenResult.kind === "invalid_credentials") {
    return jsonResponse({ error: messages.invalidCredentials }, 401);
  }

  if (
    tokenResult.kind === "unavailable" ||
    tokenResult.kind === "invalid_session"
  ) {
    logger.error("Keycloak returned an invalid token response");
    return jsonResponse({ error: messages.unavailable }, 503);
  }

  const revokeSession = async (
    refreshToken: string,
    failureMessage: string,
  ) => {
    try {
      const result = await logoutKeycloakSession({
        ...keycloakConfiguration,
        refreshToken,
      });

      if (result === "unavailable") {
        logger.error(failureMessage);
      }
    } catch {
      logger.error(failureMessage);
    }
  };

  let sessionEstablished = false;

  try {
    let keycloakSubject: Awaited<ReturnType<typeof requestKeycloakSubject>>;

    try {
      keycloakSubject = await requestKeycloakSubject({
        issuer: keycloakConfiguration.issuer,
        accessToken: tokenResult.tokens.accessToken,
      });
    } catch {
      logger.error("Keycloak userinfo request failed");
      return jsonResponse({ error: messages.unavailable }, 503);
    }

    if (keycloakSubject.kind === "invalid_token") {
      return jsonResponse({ error: messages.invalidCredentials }, 401);
    }

    if (keycloakSubject.kind === "unavailable") {
      logger.error("Keycloak returned invalid userinfo");
      return jsonResponse({ error: messages.unavailable }, 503);
    }

    let user: { id: string; classId: string; userId: string } | null;

    try {
      user = await prisma.user.findUnique({
        where: {
          keycloakUserId: keycloakSubject.subject,
          class: { is: {} },
        },
        select: { id: true, classId: true, userId: true },
      });
    } catch {
      logger.error("Application user lookup failed");
      return jsonResponse({ error: messages.unavailable }, 503);
    }

    if (
      !user ||
      user.classId !== input.data.classId ||
      user.userId !== input.data.userId
    ) {
      return jsonResponse({ error: messages.invalidCredentials }, 401);
    }

    let previousRefreshToken: string | undefined;

    try {
      previousRefreshToken = (await getKeycloakTokens()).refreshToken;
      await setKeycloakTokens(tokenResult.tokens);
    } catch {
      logger.error("Keycloak token cookie setup failed");

      try {
        await clearKeycloakTokens();
      } catch {
        logger.error("Keycloak failed login cookie clearing failed");
      }

      return jsonResponse({ error: messages.unavailable }, 503);
    }

    sessionEstablished = true;

    if (
      previousRefreshToken &&
      previousRefreshToken !== tokenResult.tokens.refreshToken
    ) {
      await revokeSession(
        previousRefreshToken,
        "Keycloak could not revoke a previous login",
      );
    }

    return jsonResponse({ success: true }, 200);
  } finally {
    if (!sessionEstablished) {
      await revokeSession(
        tokenResult.tokens.refreshToken,
        "Keycloak could not revoke a failed login",
      );
    }
  }
};
