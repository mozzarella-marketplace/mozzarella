import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/auth/csrf";
import { logoutKeycloakSession } from "@/lib/auth/keycloak";
import { clearKeycloakTokens, getKeycloakTokens } from "@/lib/auth/session";
import { env } from "@/lib/config/env";
import { logger } from "@/lib/logging/logger";

export const runtime = "nodejs";

const jsonResponse = (status: number) =>
  NextResponse.json({}, { status, headers: { "Cache-Control": "no-store" } });

export const POST = async (request: Request) => {
  if (!isSameOriginRequest(request)) {
    return jsonResponse(403);
  }

  const { refreshToken } = await getKeycloakTokens();
  let logoutFailed = false;

  if (refreshToken) {
    if (
      !env.KEYCLOAK_ISSUER ||
      !env.KEYCLOAK_CLIENT_ID ||
      !env.KEYCLOAK_CLIENT_SECRET
    ) {
      logoutFailed = true;
    } else {
      try {
        logoutFailed =
          (await logoutKeycloakSession({
            issuer: env.KEYCLOAK_ISSUER,
            clientId: env.KEYCLOAK_CLIENT_ID,
            clientSecret: env.KEYCLOAK_CLIENT_SECRET,
            refreshToken,
          })) === "unavailable";
      } catch {
        logoutFailed = true;
      }
    }
  }

  try {
    await clearKeycloakTokens();
  } catch {
    logger.error("Keycloak token cookie clearing failed");
    return jsonResponse(503);
  }

  if (logoutFailed) {
    logger.error("Keycloak session logout failed");
    return jsonResponse(503);
  }

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
};
