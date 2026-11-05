import { NextResponse } from "next/server";
import { AuthError, requireAuth } from "@/lib/auth/current-user";
import { clearKeycloakTokens } from "@/lib/auth/session";
import { getLoginUrl, getReturnTo } from "@/lib/auth/return-to";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const returnTo = getReturnTo(
    new URL(request.url).searchParams.get("returnTo"),
  );
  let destination = returnTo;

  try {
    await requireAuth();
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      await clearKeycloakTokens();
      destination = getLoginUrl(returnTo);
    } else {
      logger.error("Keycloak page session verification failed");
      return NextResponse.json(
        { error: getMessages().auth.login.unavailable },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "no-store");
  return response;
};
